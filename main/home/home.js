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
            this.data = [];
            this._selected = undefined;
            setInterval(() => {
                let targetIndex = this._selected.index + 1;
                let targetItem = this.data[targetIndex];
                if (targetItem === undefined) {
                    targetIndex -= this.data.length;
                    targetItem = this.data[targetIndex];
                }
                this.switchTo(targetItem);
            }, 10000);
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
                await this.switchTo(item);
            });
        }
        async switchTo(selectedItem) {
            if (this._selected !== undefined)
                this._selected.radio.toggleClass('selected');
            TL.to(newsChildren, 0.1, { opacity: 0 });
            await wait(25);
            newsElem.date.text(`${selectedItem.date}:`);
            newsElem.title.text(selectedItem.title);
            newsElem.content.html(selectedItem.content);
            selectedItem.radio.toggleClass('selected');
            this._selected = selectedItem;
            TL.to(newsChildren, 0.1, { opacity: 1 });
        }
    }
    async function init() {
        const data = await fetchJson('main/home/home.json', "no-cache");
        const newsData = new NewsData();
        let i = 0;
        for (let [title, { date, content }] of dict(data.news).items()) {
            let item = { title, date, content, radio: elem({ tag: 'radio' }), index: i };
            newsData.push(item);
            if (i === 0) {
                newsData.switchTo(item);
            }
            newsElem.radios.append(newsData[i].radio);
            i++;
        }
    }
    return { init };
};
//# sourceMappingURL=home.js.map