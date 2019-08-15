const HomePage = () => {
    class CarouselItem {
        constructor(title, image, content) {
            this.title = title;
            this.image = image;
            this.content = content;
        }
    }
    class Carousel extends BetterHTMLElement {
        constructor(elemOptions, items) {
            super(elemOptions);
            this.items = items;
            this.currentIndex = 0;
            this._switch();
            this.headline.on({
                pointerdown: () => {
                    console.log('headline pointerdown');
                    ResearchPage().init(this.currentIndex);
                },
            });
            this.left.pointerdown(() => {
                this._switch("left");
            });
            this.right.pointerdown(() => {
                this._switch("right");
            });
        }
        _switch(to) {
            TL.to([this.content.e, this.headline.e], 0.1, { opacity: 0 });
            TL.fromTo(this.e, 0.2, { opacity: 1 }, {
                opacity: 0.5,
                ease: Power2.easeIn,
                onComplete: () => {
                    if (to === "right")
                        this.currentIndex++;
                    else if (to === "left")
                        this.currentIndex--;
                    else if (to !== undefined)
                        throw new TypeError(`_switch illegal 'to' param, got: ${to}`);
                    if (this.currentIndex == -1)
                        this.currentIndex = this.items.length - 1;
                    else if (this.currentIndex == this.items.length)
                        this.currentIndex = 0;
                    this.content.text(this.items[this.currentIndex].content);
                    this.headline.text(this.items[this.currentIndex].title);
                    this.image.css({ backgroundImage: `linear-gradient(90deg, rgba(255, 255, 255,1) 40%, rgba(255,255,255,0)), url("main/research/${this.items[this.currentIndex].image}")` });
                    TL.to([this.content.e, this.headline.e], 0.3, { opacity: 1 });
                    TL.to(this.e, 1, { opacity: 1 });
                }
            });
        }
    }
    async function init() {
        console.group('HomePage init');
        const data = await fetchJson('main/home/home.json', "no-cache");
        const news = elem({
            query: '#news', children: {
                date: '.date',
                title: '.title',
                content: '.content',
                radios: '.radios'
            }
        });
        let i = 0;
        function popuplateNews(date, title, content, radio) {
            news.date.text(`${date}:`);
            news.title.text(title);
            news.content.html(content);
            radio.toggleClass('selected');
        }
        const radioElems = [];
        let selectedRadioIndex = 0;
        for (let [title, { date, content }] of dict(data.news).items()) {
            let radio = elem({ tag: 'radio' });
            radioElems.push(radio);
            if (i === 0) {
                popuplateNews(date, title, content, radio);
            }
            radio.pointerdown(() => {
                console.log('pointerdown, selectedRadioIndex:', selectedRadioIndex, 'i:', i, 'radioElems:', JSON.parse(JSON.stringify(radioElems)));
                radioElems[selectedRadioIndex].toggleClass('selected');
                popuplateNews(date, title, content, radio);
                selectedRadioIndex = radioElems.indexOf(radio);
            });
            news.radios.append(radio);
            i++;
        }
        console.groupEnd();
    }
    return { init };
};
HomePage().init();
//# sourceMappingURL=home.js.map