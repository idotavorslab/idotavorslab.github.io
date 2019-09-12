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
        for (let [i, [title, { thumbnail }]] of Object.entries(researchData)) {
            console.log(JSON.parstr({ title, thumbnail }));
            researchSnippets.append(div({ cls: 'snippet' })
                .append(img({ src: `main/research/${thumbnail}` }), div({ cls: 'snippet-title', text: title }))
                .pointerdown((event) => {
                ResearchPage().init(i);
            }));
        }
        elem({ query: "#logos > :nth-child(1)" }).pointerdown(() => window.open("https://www.tau.ac.il"));
        elem({ query: "#logos > :nth-child(2)" }).pointerdown(() => window.open("https://en-med.tau.ac.il/"));
        elem({ query: "#logos > :nth-child(3)" }).pointerdown(() => window.open("https://www.sagol.tau.ac.il/"));
    }
    return { init };
};
//# sourceMappingURL=home.js.map