const HomePage = () => {
    const newsElem = elem({
        query: '#news', children: {
            date: '.date',
            title: '.title',
            content: '.content',
            radios: '.radios'
        }
    });
    const newsChildren = newsElem.children().map(c => c.e);
    class NewsData {
        constructor() {
            this._userPressed = false;
            this.data = [];
            this._selected = undefined;
            this.startAutoSwitch();
            return new Proxy(this, {
                get(target, prop, receiver) {
                    if (prop in target) {
                        return target[prop];
                    }
                    const parsedInt = parseInt(prop);
                    if (!isNaN(parsedInt)) {
                        return target.data[parsedInt];
                    }
                    console.warn("NewsData.constructor.proxy.get, prop not in target and parsedInt is NaN", JSON.parse(JSON.stringify({ target, prop })));
                    return undefined;
                }
            });
        }
        push(item) {
            this.data.push(item);
            item.radio.pointerdown(async () => {
                this._userPressed = true;
                this.stopAutoSwitch();
                await this.switchTo(item);
            });
        }
        async switchTo(selectedItem) {
            if (this._selected !== undefined)
                this._selected.radio.toggleClass('selected');
            TL.to(newsChildren, 0.1, { opacity: 0 });
            await wait(25);
            for (let [text, link] of enumerate(selectedItem.links)) {
                selectedItem.content = selectedItem.content.replace(text, `<a href="${link}">${text}</a>`);
            }
            newsElem.date.text(bool(selectedItem.date) ? `${selectedItem.date}:` : '');
            newsElem.title.text(selectedItem.title);
            newsElem.content.html(selectedItem.content);
            selectedItem.radio.toggleClass('selected');
            this._selected = selectedItem;
            TL.to(newsChildren, 0.1, { opacity: 1 });
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
                this.switchTo(targetItem);
            }, 10000);
        }
        stopAutoSwitch() {
            clearInterval(this._interval);
        }
    }
    async function init() {
        newsElem.mouseover(() => newsData.stopAutoSwitch());
        newsElem.mouseout(() => newsData.startAutoSwitch());
        const data = await fetchJson('main/home/home.json', "no-cache");
        elem({ query: "#non_news > .text" }).text(data["our lab"]);
        const newsData = new NewsData();
        let i = 0;
        for (let [title, { date, content, links }] of dict(data.news).items()) {
            let item = { title, date, content, links, radio: div({ cls: 'radio' }), index: i };
            newsData.push(item);
            if (i === 0) {
                newsData.switchTo(item);
            }
            newsElem.radios.append(newsData[i].radio);
            i++;
        }
        const researchData = Object.entries(await fetchJson('main/research/research.json', "no-cache"));
        const researchSnippets = elem({ query: "#research_snippets" });
        function getResearchSnippetsGridDims(snippetsNum) {
            const arr = [];
            while (snippetsNum > 5) {
                let mod3 = snippetsNum % 3;
                let mod4 = snippetsNum % 4;
                let mod5 = snippetsNum % 5;
                let mods = { 3: mod3, 4: mod4, 5: mod5 };
                let subtractor = -1;
                let modsEntries = Object.entries(mods).map(([k, v]) => [parseInt(k), v]);
                if (Object.values(mods).includes(0)) {
                    for (let [k, v] of modsEntries) {
                        if (v !== 0)
                            continue;
                        if (k > subtractor)
                            subtractor = k;
                    }
                    for (let [k, v] of modsEntries) {
                        if (v > subtractor)
                            subtractor = k;
                    }
                }
                else {
                    let max = 0;
                    for (let [k, v] of modsEntries) {
                        if (v > max) {
                            subtractor = k;
                            max = v;
                        }
                    }
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
        console.log(JSON.parstr({ dims, researchData }));
        for (let [i, j] of Object.entries(dims)) {
            i = int(i);
            let row = div({ cls: `row row-${j}` });
            let sumSoFar;
            if (i == 0) {
                sumSoFar = 0;
            }
            else {
                sumSoFar = dims
                    .slice(0, i)
                    .reduce((a, b) => a + b);
            }
            let k = i == 0 ? 0 : dims[i - 1];
            console.group(JSON.parstr({ i, j, sumSoFar, k, 'sumSoFar + j': sumSoFar + j }));
            for (k; k < sumSoFar + j; k++) {
                let [title, { thumbnail }] = researchData[k];
                let css = {};
                console.log(JSON.parstr(Object.assign({ k, title, thumbnail }, css)));
                let image = img({ src: `main/research/${thumbnail}` }).css(css);
                const colorThief = new ColorThief();
                image.e.addEventListener('load', function () {
                    const color = colorThief.getColor(image.e);
                    console.log(JSON.parstr({ color, k, title, thumbnail }));
                });
                row.append(image);
            }
            console.groupEnd();
            researchSnippets.append(row);
        }
    }
    return { init };
};
HomePage().init();
//# sourceMappingURL=home.js.map