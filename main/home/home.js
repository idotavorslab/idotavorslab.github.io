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
            this._switch(0);
            this.headline.on({
                pointerdown: () => {
                    console.log('headline pointerdown');
                },
            });
            let _buttonAnimation = {
                name: 'scaleDownAndReset',
                duration: '50ms',
                timingFunction: 'linear',
            };
            this.left.click(async () => {
                TweenMax.fromTo(this.e, 0.05, { filter: 'brightness(1)' }, {
                    filter: 'brightness(0.75)',
                    ease: Power4.easeOut,
                    onComplete: () => {
                        this._switchLeft();
                        TweenMax.to(this.e, 1, { filter: 'brightness(1)' });
                    }
                });
            });
            this.right.click(() => {
                console.log('right click');
                this._switchRight();
                this.right.animate(_buttonAnimation);
            });
        }
        _switch(index) {
            this.currentIndex = index;
            if (this.currentIndex == -1)
                this.currentIndex = this.items.length - 1;
            else if (this.currentIndex == this.items.length)
                this.currentIndex = 0;
            this.content.text(this.items[this.currentIndex].content);
            this.headline.text(this.items[this.currentIndex].title);
            this.css({ backgroundImage: `linear-gradient(rgb(100,100,100), #222), url("main/research/${this.items[this.currentIndex].image}")` });
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
        for (let [title, { image, content }] of dict(data).items()) {
            let item = new CarouselItem(title, image, content);
            carouselItems.push(item);
        }
        const carousel = new Carousel({
            query: "#carousel", children: {
                left: '.left',
                right: '.right',
                content: 'content',
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