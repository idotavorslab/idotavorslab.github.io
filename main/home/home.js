const HomePage = () => {
    async function init() {
        const data = await fetchJson('main/home/home.json', "no-cache");
        const newsElem = elem({
            query: '#news', children: {
                date: '.date',
                title: '.title',
                content: '.content',
                radios: '.radios'
            }
        });
        let i = 0;
        function popuplateNews(date, title, content, radio) {
            newsElem.date.text(`${date}:`);
            newsElem.title.text(title);
            newsElem.content.html(content);
            radio.toggleClass('selected');
        }
        const newsObjs = [];
        let lastSelectedRadioIndex = 0;
        for (let [title, { date, content }] of dict(data.news).items()) {
            let radio = elem({ tag: 'radio' });
            newsObjs.push({ title, date, content, radio });
            if (i === 0) {
                popuplateNews(date, title, content, radio);
            }
            radio.pointerdown(async () => {
                newsObjs[lastSelectedRadioIndex].radio.toggleClass('selected');
                TL.to(newsChildren, 0.1, { opacity: 0, });
                await wait(25);
                popuplateNews(date, title, content, radio);
                TL.to(newsChildren, 0.1, { opacity: 1 });
                lastSelectedRadioIndex = radioElems.indexOf(radio);
            });
            newsElem.radios.append(radio);
            i++;
        }
        const radioElems = newsObjs.map(news => news.radio);
        const newsChildren = newsElem.children().map(c => c.e);
        setInterval(() => {
        }, 7000);
    }
    return { init };
};
HomePage().init();
//# sourceMappingURL=home.js.map