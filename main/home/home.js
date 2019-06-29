const HomePage = () => {
    class CarouselItem {
        constructor(title, image, text) {
            this.title = title;
            this.image = image;
            this.text = text;
        }
    }
    class Carousel extends Elem {
        constructor(elemOptions, items) {
            super(elemOptions);
            this.items = items;
            this.currentIndex = 0;
            this._switch(0);
            this.headline.on({
                pointerdown: () => {
                    console.log('headline pointerdown');
                },
            });
            let _buttonAnimation = {
                name: 'downAndUp',
                duration: '25ms',
                timingFunction: 'linear',
                iterationCount: 1
            };
            this.left.on({
                pointerdown: () => {
                    console.log('left pointerdown', this);
                    this.left.animate(_buttonAnimation);
                    this._switchLeft();
                },
            });
            this.right.on({
                pointerdown: () => {
                    console.log('right pointerdown');
                    this.right.animate(_buttonAnimation);
                    this._switchRight();
                },
            });
        }
        _switch(index) {
            this.currentIndex = index;
            if (this.currentIndex == -1)
                this.currentIndex = this.items.length - 1;
            else if (this.currentIndex == this.items.length)
                this.currentIndex = 0;
            console.log('this.currentIndex: ', this.currentIndex);
            this.css({ backgroundImage: `linear-gradient(rgb(100,100,100), #FFF), url("main/research/${this.items[this.currentIndex].image}")` });
            this.headline.text(this.items[this.currentIndex].title);
        }
        _switchRight() {
            this._switch(this.currentIndex + 1);
        }
        _switchLeft() {
            this._switch(this.currentIndex - 1);
        }
    }
    async function init() {
        console.group('HomePage init');
        let req = new Request('main/research/research.json', { cache: "no-cache" });
        const data = await (await fetch(req)).json();
        console.log({ data });
        const carouselItems = [];
        for (let [title, { image, text }] of dict(data).items()) {
            let item = new CarouselItem(title, image, text);
            carouselItems.push(item);
        }
        const carousel = new Carousel({
            query: "carousel", children: {
                left: '.left',
                right: '.right',
                headline: 'headline'
            }
        }, carouselItems);
        console.log(carousel);
        console.groupEnd();
    }
    return { init };
};
HomePage().init();
//# sourceMappingURL=home.js.map