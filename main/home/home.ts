const HomePage = () => {
    type TNewsDataItem = { title: string, date: string, content: string, links: TMap<string>, radio: BetterHTMLElement, index: number };
    type TRightWidget = BetterHTMLElement & {
        mainImageContainer: Div,
        news: Div & {
            title: Div,
            date: Div,
            content: Div
        },
        radios: Div,
    };
    /** The single #news>date,title,content,radios html to show selected news */
    const rightWidget: TRightWidget = <TRightWidget>elem({
        query: '#right_widget', children: {
            mainImageContainer: '#main_image_container',
            news: {
                '#news': {
                    title: '.title',
                    date: '.date',
                    content: '.content'
                }
            },
            radios: '#radios',
        }
    });
    const newsChildren: HTMLElement[] = rightWidget.news.children().map(c => c.e);
    
    class NewsData {
        readonly data: TNewsDataItem[];
        private _selected: TNewsDataItem;
        private _interval: number;
        private _userPressed: boolean = false;
        
        constructor() {
            this.data = [];
            this._selected = undefined;
            this.startAutoSwitch();
            
            
            return new Proxy(this, {
                get(target, prop: string | number | symbol, receiver: any): any {
                    if (prop in target) {
                        return target[prop];
                    }
                    const parsedInt = parseInt(<string>prop);
                    if (!isNaN(parsedInt)) {
                        return target.data[parsedInt];
                    }
                    console.warn("NewsData.constructor.proxy.get, prop not in target and parsedInt is NaN",
                        JSON.parse(JSON.stringify({target, prop})));
                    return undefined;
                }
            })
        }
        
        
        push(item: TNewsDataItem) {
            this.data.push(item);
            item.radio.pointerdown(async () => {
                this._userPressed = true;
                this.stopAutoSwitch();
                await this.switchTo(item);
            })
        }
        
        
        async switchTo(selectedItem: TNewsDataItem) {
            if (this._selected !== undefined)
                this._selected.radio.toggleClass('selected');
            
            TL.to(newsChildren, 0.1, {opacity: 0});
            await wait(25);
            
            if (!selectedItem.content.includes('<a href')) {
                for (let [text, link] of enumerate(selectedItem.links)) {
                    selectedItem.content = selectedItem.content.replace(text, `<a href="${link}">${text}</a>`)
                }
            }
            
            // HACK: add margin-bottom to date only if not visible
            if (bool(selectedItem.date))
                rightWidget.news.date.text(selectedItem.date).toggleClass('mb', false);
            else
                rightWidget.news.date.text('').toggleClass('mb', true);
            
            rightWidget.news.title.text(selectedItem.title);
            rightWidget.news.content.html(selectedItem.content);
            selectedItem.radio.toggleClass('selected');
            
            this._selected = selectedItem;
            
            TL.to(newsChildren, 0.1, {opacity: 1});
            
        }
        
        startAutoSwitch() {
            if (this._userPressed) {
                return;
            }
            
            
            this._interval = setInterval(() => {
                let targetIndex = this._selected.index + 1;
                let targetItem = this.data[targetIndex];
                if (targetItem === undefined) {
                    targetIndex -= this.data.length;
                    targetItem = this.data[targetIndex];
                }
                this.switchTo(targetItem)
            }, 10000);
        }
        
        stopAutoSwitch() {
            clearInterval(this._interval);
        }
    }
    
    async function init() {
        
        rightWidget.mouseover(() => newsData.stopAutoSwitch());
        rightWidget.mouseout(() => newsData.startAutoSwitch());
        
        // ***  About
        const data = await fetchJson('main/home/home.json', "no-cache");
        const aboutText = elem({query: "#about > .about-text"});
        for (let [i, p] of <[number, string][]><unknown>Object.entries(data["about-text"])) {
            let cls = undefined;
            if (i == 0)
                cls = 'bold';
            aboutText.append(elem({tag: 'p', text: p, cls}))
        }
        // ***  News
        /** Holds the data from .json in an array, plus the matching radio BetterHTMLElement */
        const newsData = new NewsData();
        
        
        let i = 0;
        const radios = elem({id: 'radios'});
        for (let [title, {date, content, links}] of dict(data.news).items()) {
            let item: TNewsDataItem = {title, date, content, links, radio: div({cls: 'radio'}), index: i};
            newsData.push(item);
            if (i === 0) {
                newsData.switchTo(item);
            }
            
            radios.append(newsData[i].radio);
            i++;
            
        }
        // ***  Research Snippets
        type TResearchData = [string, { content: string, thumbnail: string, image: string }][];
        const researchData: TResearchData = Object.entries(await fetchJson('main/research/research.json', "no-cache"));
        const researchSnippets = elem({query: "#research_snippets"});
        
        for (let [i, [title, {thumbnail}]] of Object.entries(researchData)) {
            researchSnippets.append(
                div({cls: 'snippet'})
                    .append(
                        img({src: `main/research/${thumbnail}`}),
                        div({cls: 'snippet-title', text: title})
                    )
                    .pointerdown((event) => {
                        // @ts-ignore
                        ResearchPage().init(i);
                        history.pushState(null, null, '#research')
                    })
            )
        }
        
        
        /*function getResearchSnippetsGridDims(snippetsNum: number): number[] {
            const arr = [];
            while (snippetsNum > 5) {
                let mod3 = snippetsNum % 3;
                let mod4 = snippetsNum % 4;
                let mod5 = snippetsNum % 5;
                let mods = {3: mod3, 4: mod4, 5: mod5};
                let subtractor = -1;
                let modsEntries = Object.entries(mods).map(([k, v]) => [parseInt(k), v]);
                if (Object.values(mods).includes(0)) {
                    // take the largest key with value == 0
                    // this also accounts for edge cases with multiple zeroes, like 12, where 3:0, 4:0, 5:2 => 4,4,4
                    for (let [k, v] of modsEntries) {
                        if (v !== 0)
                            continue;
                        if (k > subtractor)
                            subtractor = k;
                    }
                    // unless a value is bigger than the largest key, in which case take *that* value's key
                    // for eg 9, where 3:0, 4:1, 5:4 => 5,4
                    for (let [k, v] of modsEntries) {
                        if (v > subtractor)
                            subtractor = k;
                    }
                    
                    
                } else { // no zero
                    // take the key with the maximum value
                    let max = 0;
                    for (let [k, v] of modsEntries) {
                        if (v > max) {
                            subtractor = k;
                            max = v;
                        }
                    }
                    // in case more than one value is max: take the biggest key whose value is max.
                    // for eg 17, where 3:2, 4:1, 5:2 => 5,4,4,4
                    let filtered = modsEntries.filter(([k, v]) => v === max);
                    if (filtered.length > 1) {
                        subtractor = Math.max(...filtered.map(([k, v]) => k));
                    }
                }
                arr.push(subtractor);
                snippetsNum -= subtractor;
                
                
            }
            arr.push(snippetsNum);
            return arr;
        }
        
        const dims = getResearchSnippetsGridDims(researchData.length);
        console.log(JSON.parstr({dims, researchData}));
        for (let [i, j] of <[number, any]>Object.entries(dims)) {
            i = int(i);
            
            let row = div({cls: `row row-${j}`});
            let sumSoFar;
            if (i == 0) {
                sumSoFar = 0;
            } else {
                sumSoFar = dims
                    .slice(0, i)
                    .reduce((a, b) => a + b)
            }
            
            let k = i == 0 ? 0 : dims[i - 1];
            console.group(JSON.parstr({i, j, sumSoFar, k, 'sumSoFar + j': sumSoFar + j}));
            for (k; k < sumSoFar + j; k++) {
                let [title, {thumbnail}] = researchData[k];
                let css = {
                    // gridRow: `${i}/${i}`,
                    // gridColumn: `${k}/${k}`
                };
                console.log(JSON.parstr({k, title, thumbnail, ...css}));
                let image = img({src: `main/research/${thumbnail}`}).css(css);
                let snippet = div({cls: 'snippet-container'})
                    .append(
                        image,
                        div({cls: 'snippet-title', text: title})
                    );
                
                const colorThief = new ColorThief();
                image.e.addEventListener('load', function () {
                    const palette = colorThief.getPalette(image.e);
                    snippet.css({backgroundColor: `rgb(${palette[10]})`});
                    console.log(JSON.parstr({palette, k, title, thumbnail}));
                });
                
                row.append(snippet)
            }
            
            console.groupEnd();
            researchSnippets.append(row);
            
        }
        */
        
        // ***  Logos
        elem({query: "#logos > :nth-child(1)"}).pointerdown(() => window.open("https://www.tau.ac.il"));
        elem({query: "#logos > :nth-child(2)"}).pointerdown(() => window.open("https://en-med.tau.ac.il/"));
        elem({query: "#logos > :nth-child(3)"}).pointerdown(() => window.open("https://www.sagol.tau.ac.il/"));
        
        
    }
    
    
    return {init}
};



