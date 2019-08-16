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
            return new Proxy(this, {
                get(target, prop, receiver) {
                    if (prop in target) {
                        return target[prop];
                    }
                    const parsedInt = parseInt(prop);
                    if (!isNaN(parsedInt)) {
                        return target.data[parsedInt];
                    }
                    console.error("NewsData.constructor.proxy.get, prop not in target and parsedInt is NaN", JSON.parse(JSON.stringify({ target, prop })));
                }
            });
        }
        select(index) {
            const newsDataItem = this[index];
            newsElem.date.text(`${newsDataItem.date}:`);
            newsElem.title.text(newsDataItem.title);
            newsElem.content.html(newsDataItem.content);
            newsDataItem.radio.toggleClass('selected');
            this._selected = newsDataItem;
        }
        push(item) {
            this.data.push(item);
            const itemIndex = this.data.length - 1;
            item.radio.pointerdown(async () => {
                this._selected.radio.toggleClass('selected');
                TL.to(newsChildren, 0.1, { opacity: 0, });
                await wait(25);
                this.select(itemIndex);
                TL.to(newsChildren, 0.1, { opacity: 1 });
            });
        }
    }
    async function init() {
        const data = await fetchJson('main/home/home.json', "no-cache");
        const newsData = new NewsData();
        let i = 0;
        for (let [title, { date, content }] of dict(data.news).items()) {
            newsData.push({ title, date, content, radio: elem({ tag: 'radio' }) });
            if (i === 0) {
                newsData.select(0);
            }
            newsElem.radios.append(newsData[i].radio);
            i++;
        }
        setInterval(() => {
        }, 7000);
    }
    return { init };
};
HomePage().init();
//# sourceMappingURL=home.js.map