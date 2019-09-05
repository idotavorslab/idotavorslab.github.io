const HomePage = () => {
    type TNewsDataItem = { title: string, date: string, content: string, links: TMap<string>, radio: BetterHTMLElement, index: number };
    type TNewsElem = BetterHTMLElement & { date: Div, title: Div, content: Div, radios: Div };
    /** The single #news>date,title,content,radios html to show selected news */
    const newsElem: TNewsElem = <TNewsElem>elem({
        query: '#news', children: {
            date: '.date',
            title: '.title',
            content: '.content',
            radios: '.radios'
        }
    });
    const newsChildren: HTMLElement[] = newsElem.children().map(c => c.e);
    
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
            
            for (let [text, link] of enumerate(selectedItem.links)) {
                selectedItem.content = selectedItem.content.replace(text, `<a href="${link}">${text}</a>`)
            }
            newsElem.date.text(bool(selectedItem.date) ? `${selectedItem.date}:` : '');
            newsElem.title.text(selectedItem.title);
            newsElem.content.html(selectedItem.content);
            selectedItem.radio.toggleClass('selected');
            
            this._selected = selectedItem;
            
            TL.to(newsChildren, 0.1, {opacity: 1});
            
        }
        
        startAutoSwitch() {
            if (this._userPressed)
                return;
            
            
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
        // ***  News
        newsElem.mouseover(() => newsData.stopAutoSwitch());
        newsElem.mouseout(() => newsData.startAutoSwitch());
        
        
        const data = await fetchJson('main/home/home.json', "no-cache");
        elem({query: "#non_news > .text"}).text(data["our lab"]);
        
        /** Keep the data from .json in an array, plus the matching radio BetterHTMLElement */
        const newsData = new NewsData();
        
        
        let i = 0;
        for (let [title, {date, content, links}] of dict(data.news).items()) {
            let item: TNewsDataItem = {title, date, content, links, radio: div({cls: 'radio'}), index: i};
            newsData.push(item);
            if (i === 0) {
                newsData.switchTo(item);
            }
            
            newsElem.radios.append(newsData[i].radio);
            i++;
            
        }
        // ***  Research
        const researchData = Object.entries(await fetchJson('main/research/research.json', "no-cache"));
        const researchSnippets = elem({query: "#research_snippets"});
        
        function foo(len) {
            if (len >= 17)debugger;
            const arr = [];
            while (len > 5) {
                let mod3 = len % 3;
                let mod4 = len % 4;
                let mod5 = len % 5;
                let mods = {3: mod3, 4: mod4, 5: mod5};
                let subtractor = -1;
                let modsEntries = Object.entries(mods).map(([k, v]) => [parseInt(k), v]);
                if (Object.values(mods).includes(0)) {
                    // take the largest key with value:0
                    // this also accounts for edge cases with more than one modolu 0, eg 12, where 3:0, 4:0, 5:2 | 4,4,4
                    for (let [k, v] of modsEntries) {
                        if (v !== 0)
                            continue;
                        if (k > subtractor)
                            subtractor = k;
                    }
                    // unless a value is bigger than the largest key, then take that value's key
                    // for eg 9, where 3:0, 4:1, 5:4 | 5,4
                    for (let [k, v] of modsEntries) {
                        if (v > subtractor)
                            subtractor = k;
                    }
                    
                    
                } else {
                    // TODO: what about 17? 3:2, 4:1, 5:2
                    let max = 0;
                    for (let [k, v] of modsEntries) {
                        if (v > max) {
                            subtractor = k;
                            max = v;
                        }
                    }
                    // for eg 17, where 3:2, 4:1, 5:2 | 5,4,4,4
                    let filtered = modsEntries.filter(([k, v]) => v === max);
                    if (filtered.length > 1) {
                    
                    }
                }
                arr.push(subtractor);
                len -= subtractor;
                
                
            }
            arr.push(len);
            return arr;
        }
        
        for (let i = 3; i < 22; i++) {
            
            console.log(`foo(${i}):`, foo(i));
        }
        /*const arr = [];
        let len = researchData.length;
        while (len > 5) {
            let mod3 = len % 3;
            let mod4 = len % 4;
            let mod5 = len % 5;
            let mods = {3: mod3, 4: mod4, 5: mod5};
            let subtractor = -1;
            if (Object.values(mods).includes(0)) {
                // this also accounts for edge cases with more than one modolu 0, eg 12, where 3:0, 4:0, 5:2
                for (let [k, v] of Object.entries(mods).map(([k, v]) => [parseInt(k), v])) {
                    if (v !== 0) continue;
                    if (k > subtractor) subtractor = k;
                }
                
                
            } else {
                let max = 0;
                for (let [k, v] of Object.entries(mods).map(([k, v]) => [parseInt(k), v])) {
                    if (v > max) {
                        subtractor = k;
                        max = v;
                    }
                }
            }
            arr.push(subtractor);
            len -= subtractor;
            
            
        }
        arr.push(len);
        */
        /*researchSnippets.cacheAppend(
            {row0: div({cls: `row row-${researchData.length}`})}
        );
        for (let [i, [title, {thumbnail}]] of Object.entries(researchData)) {
            i = int(i);
            console.log(i);
            researchSnippets.row0.append(
                img({src: `main/research/${thumbnail}`})
                // .css({gridColumn: `${i + 1}/${i + 1}`})
            )
        }
        */
        
        
    }
    
    
    return {init}
};
HomePage().init();




