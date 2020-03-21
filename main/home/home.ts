// used in research.ts
type TResearchData = TMap<{ text: string, image: string, circle?: boolean, thumbnail: string }>;
const HomePage = () => {

    type TNewsDataItem = { title: string, date: string, content: string, links: TMap<string>, radio: BetterHTMLElement, index: number };
    type TRightWidget = BetterHTMLElement & {
        newsCoverImageContainer: Div,
        news: Div & {
            title: Div,
            date: Div,
            content: Div
        },
        radios: Div,
    };

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
            item.radio.click(async () => {
                this._userPressed = true;
                this.stopAutoSwitch();
                await this.switchTo(item);
            })
        }


        async switchTo(selectedItem: TNewsDataItem) {
            if (this._selected !== undefined) {
                this._selected.radio.toggleClass('selected');
            }
            TL.to(newsChildren, 0.1, {opacity: 0});
            await wait(25);

            if (!selectedItem.content.includes('<a')) {
                for (let [text, link] of enumerate(selectedItem.links)) {
                    selectedItem.content = selectedItem.content.replace(text, `<a target="_blank" href="${link}">${text}</a>`)
                }
            }

            // HACK: add margin-bottom to date only if not visible
            if (bool(selectedItem.date)) {
                rightWidget.news.date.text(selectedItem.date).toggleClass('mb', false);
            } else {
                rightWidget.news.date.text('').toggleClass('mb', true);
            }

            rightWidget.news.title.text(selectedItem.title);
            rightWidget.news.content.html(selectedItem.content);
            showArrowOnHover(rightWidget.news.content.children('a'));
            selectedItem.radio.toggleClass('selected');

            this._selected = selectedItem;

            TL.to(newsChildren, 0.1, {opacity: 1});
            // console.log('isOverflown:', isOverflown(rightWidget.news.e));
            let overflown = isOverflown(rightWidget.news.e);
            if (overflown) {
                let lastChild = rightWidget.news.content.e.lastChild as HTMLParagraphElement;
                let oldText = lastChild.innerText;
                let newText = oldText.slice(0, oldText.length / 2);
                lastChild.innerText = newText;
                while (isOverflown(rightWidget.news.e)) {
                    oldText = lastChild.innerText;
                    if (oldText.length < 30) {
                        lastChild.remove();
                        lastChild = rightWidget.news.content.e.lastChild as HTMLParagraphElement;
                        oldText = lastChild.innerText;
                    }
                    newText = oldText.slice(0, oldText.length / 2);
                    lastChild.innerText = newText;
                }
                lastChild.innerText = `${lastChild.innerText}...`;
                lastChild.classList.add('faded');
                let readMore = anchor({text: 'Read more', cls: 'center'})
                    .target("_blank")
                    .click(async () => {
                        // rightWidget.css({height: 'auto'});
                        rightWidget.news.content
                            .html(selectedItem.content);
                        lastChild.classList.remove('faded');
                        readMore.remove();
                        console.log('isOverflown:', isOverflown(rightWidget.news.e));
                        let diff = rightWidget.news.e.scrollHeight - rightWidget.news.e.clientHeight;
                        rightWidget.css({height: `${rightWidget.e.clientHeight + diff}px`});

                    });
                rightWidget.news.content.append(readMore)
            }


        }

        startAutoSwitch() {
            if (this._userPressed) {
                return;
            }

            console.log('startAutoSwitch');
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
            console.log('stopAutoSwitch');
            clearInterval(this._interval);
        }
    }

    let rightWidget: TRightWidget;
    let newsChildren: HTMLElement[];

    const NO_NEWS = window.innerWidth <= $BP3;

    function buildRightWidgetAndNewsChildren() {
        if (NO_NEWS) {
            return;
        }
        rightWidget = <TRightWidget>elem({
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
        newsChildren = rightWidget.news.children().map(c => c.e);
    }

    WindowElem.promiseLoaded().then(buildRightWidgetAndNewsChildren);


    async function init() {


        // ***  About
        type TFunding = TMap<{ image: string, text: string, large?: boolean, link: string }>;
        type TNews = TMap<{ content: string, date?: string, links: TMap<any> }>;
        type THomeData = { logo: string, "about-text": string, "news-cover-image": string, news: TNews, funding: TFunding };
        const data = await fetchDict<THomeData>('main/home/home.json');


        if (MOBILE === undefined) {
            await WindowElem.promiseLoaded();
        }
        if (!NO_NEWS) {
            while (rightWidget === undefined) {
                await wait(11);
            }
            rightWidget.newsCoverImageContainer
                .append(img({src: `main/home/${data["news-cover-image"]}`}));
        } else {
            console.log(`setting #mobile_cover_image_container > img src to main/home/${data["news-cover-image"]}`, 'grn');
            elem({query: '#mobile_cover_image_container > img'}).attr({src: `main/home/${data["news-cover-image"]}`});
        }

        if (Navbar === undefined) {
            await WindowElem.promiseLoaded();
        }
        Navbar.home.attr({src: `main/home/${data.logo}`});

        const aboutText = elem({query: "#about > .about-text"});

        const splitParagraphs = (val: string): string[] => val.split("</p>").join("").split("<p>").slice(1);
        for (let [i, p] of enumerate(splitParagraphs(data["about-text"]))) {
            let cls = undefined;
            if (i == 0) {
                cls = 'bold';
            }
            aboutText.append(paragraph({text: p, cls}))
        }
        if (!NO_NEWS) {
            console.log('HomePage().init(), building News, entered !NO_NEWS clause', JSON.parstr({NO_NEWS}));
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
            rightWidget.mouseover(() => newsData.stopAutoSwitch());
            rightWidget.mouseout(() => newsData.startAutoSwitch());
        }
        // ***  Research Snippets

        const researchData = await fetchDict<TResearchData>('main/research/research.json');
        const researchSnippets = elem({query: "#research_snippets"});

        for (let [i, [title, {thumbnail}]] of enumerate(researchData.items())) {

            researchSnippets.append(
                div({cls: 'snippet'})
                    .append(
                        img({src: `main/research/${thumbnail}`}),
                        div({cls: 'snippet-title', text: title})
                    )
                    .click((event) => {
                        ResearchPage().init(i);
                        history.pushState(null, null, '#research');
                        // Footer.attr({hidden: ''});
                        Body.footer.attr({hidden: ''});
                        Navbar.select(Navbar.research);
                    })
            )
        }
        // ***  Funding
        const fundingData = data.funding;
        Body.fundingSection.removeAttr('hidden');
        // FundingSection.removeAttr('hidden');

        for (let [title, {image, text, large, link}] of dict(fundingData).items()) {
            let sponsorImage = img({src: `main/home/${image}`});
            if (large === true) {
                sponsorImage.class('large');
            }
            // FundingSection.sponsorsContainer.append(
            Body.fundingSection.sponsorsContainer.append(
                div({cls: 'sponsor'}).append(
                    sponsorImage,
                    div({cls: 'sponsor-title', text: title}),
                    div({cls: 'sponsor-text', text})
                ).click(() => window.open(link))
            )
        }


    }


    return {init}
};



