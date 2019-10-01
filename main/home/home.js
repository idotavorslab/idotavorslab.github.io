const HomePage = () => {
    const rightWidget = elem({
        query: '#right_widget',
        children: {
            newsCoverImageContainer: '#news_cover_image_container',
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
    const newsChildren = rightWidget.news.children().map(c => c.e);
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
            if (!selectedItem.content.includes('<a')) {
                for (let [text, link] of enumerate(selectedItem.links)) {
                    selectedItem.content = selectedItem.content.replace(text, `<a target="_blank" href="${link}">${text}</a>`);
                }
            }
            if (bool(selectedItem.date))
                rightWidget.news.date.text(selectedItem.date).toggleClass('mb', false);
            else
                rightWidget.news.date.text('').toggleClass('mb', true);
            rightWidget.news.title.text(selectedItem.title);
            rightWidget.news.content.html(selectedItem.content);
            showArrowOnHover(rightWidget.news.content.children('a'));
            selectedItem.radio.toggleClass('selected');
            this._selected = selectedItem;
            TL.to(newsChildren, 0.1, { opacity: 1 });
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
                this.switchTo(targetItem);
            }, 10000);
        }
        stopAutoSwitch() {
            clearInterval(this._interval);
        }
    }
    async function init() {
        const data = await fetchJson('main/home/home.json');
        rightWidget.newsCoverImageContainer
            .append(img({ src: `main/home/${data["news-cover-image"]}` }));
        elem({ query: '#navbar > img.home' }).attr({ src: `main/home/${data.logo}` });
        const aboutText = elem({ query: "#about > .about-text" });
        const splitParagraphs = (val) => val.split("</p>").join("").split("<p>").slice(1);
        for (let [i, p] of Object.entries(splitParagraphs(data["about-text"]))) {
            let cls = undefined;
            if (i == "0")
                cls = 'bold';
            aboutText.append(paragraph({ text: p, cls }));
        }
        const newsData = new NewsData();
        let i = 0;
        const radios = elem({ id: 'radios' });
        for (let [title, { date, content, links }] of dict(data.news).items()) {
            let item = { title, date, content, links, radio: div({ cls: 'radio' }), index: i };
            newsData.push(item);
            if (i === 0) {
                newsData.switchTo(item);
            }
            radios.append(newsData[i].radio);
            i++;
        }
        rightWidget.mouseover(() => newsData.stopAutoSwitch());
        rightWidget.mouseout(() => newsData.startAutoSwitch());
        const researchData = Object.entries(await fetchJson('main/research/research.json'));
        const researchSnippets = elem({ query: "#research_snippets" });
        for (let [i, [title, { thumbnail }]] of Object.entries(researchData)) {
            researchSnippets.append(div({ cls: 'snippet' })
                .append(img({ src: `main/research/${thumbnail}` }).on({
                load: () => {
                    console.log(`%cloaded: ${thumbnail}`, `color: #ffc66d`);
                }
            }), div({ cls: 'snippet-title', text: title }))
                .pointerdown((event) => {
                ResearchPage().init(i);
                history.pushState(null, null, '#research');
            }));
        }
        const fundingData = data.funding;
        const sponsorsGrid = elem({ query: "#sponsors" });
        for (let [title, { image, text, large }] of Object.entries(fundingData)) {
            let sponsorImage = img({ src: `main/home/${image}` })
                .on({
                load: () => {
                    console.log(`%cloaded: ${image}`, `color: #ffc66d`);
                }
            });
            if (large === true)
                sponsorImage.css({ width: '260px' });
            sponsorsGrid.append(div({ cls: 'sponsor' }).append(sponsorImage, div({ cls: 'sponsor-title', text: title }), div({ cls: 'sponsor-text', text })));
        }
        elem({ query: "#logos > :nth-child(1)" }).pointerdown(() => window.open("https://www.tau.ac.il"));
        elem({ query: "#logos > :nth-child(2)" }).pointerdown(() => window.open("https://en-med.tau.ac.il/"));
        elem({ query: "#logos > :nth-child(3)" }).pointerdown(() => window.open("https://www.sagol.tau.ac.il/"));
    }
    return { init };
};
//# sourceMappingURL=home.js.map