const HomePage = () => {
    class CarouselItem {
        constructor(title, image, content) {
            this.title = title;
            this.image = image;
            this.content = content;
        }
    }
    class Carousel extends Elem {
        constructor(elemOptions, items) {
            super(elemOptions);
            this.items = items;
            this.currentIndex = 0;
            this._switch();
            this.headline.on({
                pointerdown: () => {
                    console.log('headline pointerdown');
                },
            });
            this.left.click(() => {
                this._switch("left");
            });
            this.right.click(() => {
                this._switch("right");
            });
        }
        _switch(to) {
            TL.to([this.content.e, this.headline.e], 0.1, { opacity: 0 });
            TL.fromTo(this.e, 0.2, { filter: 'brightness(1)' }, {
                filter: 'brightness(0.5)',
                ease: Power2.easeIn,
                onComplete: () => {
                    console.log('complete');
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
                    this.image.css({ backgroundImage: `linear-gradient(rgb(100,100,100), #222), url("main/research/${this.items[this.currentIndex].image}")` });
                    TL.to([this.content.e, this.headline.e], 0.3, { opacity: 1 });
                    TL.to(this.e, 1, { filter: 'brightness(1)' });
                }
            });
        }
    }
    async function init() {
        console.group('HomePage init');
        let req = new Request('main/research/research.json', { cache: "no-cache" });
        const data = await (await fetch(req)).json();
        console.log({ data });
        const carouselItems = [];
        for (let [title, { image, content }] of dict(data).items()) {
            let item = new CarouselItem(title, image, content);
            carouselItems.push(item);
        }
        const carousel = new Carousel({
            query: "#carousel", children: {
                left: '.left',
                right: '.right',
                content: 'content',
                headline: 'headline',
                image: '.image'
            }
        }, carouselItems);
        console.log(carousel);
        console.groupEnd();
    }
    return { init };
};
HomePage().init();
//# sourceMappingURL=home.js.map