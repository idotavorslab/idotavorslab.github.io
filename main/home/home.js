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
                name: 'downAndUp',
                duration: '1000ms',
            };
            this.left.click(async () => {
                console.log('%cleft click', 'font-weight: 700; font-size: 15px', this);
                this._switchLeft();
                this.left.removeClass('animated');
                window.requestAnimationFrame(time => {
                    window.requestAnimationFrame(time => {
                        this.left.addClass('animated');
                    });
                });
            });
            this.right.click(() => {
                console.log('right click');
                this.right.animate(_buttonAnimation);
                this._switchRight();
            });
        }
        _switch(index) {
            this.currentIndex = index;
            if (this.currentIndex == -1)
                this.currentIndex = this.items.length - 1;
            else if (this.currentIndex == this.items.length)
                this.currentIndex = 0;
            console.log('_switch, index: ', index, 'this.currentIndex: ', this.currentIndex, 'current item: ', this.items[this.currentIndex]);
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
                left: '#left_button',
                right: '#right_button',
                content: 'content',
                headline: '#carousel_headline'
            }
        }, carouselItems);
        console.log(carousel);
        console.groupEnd();
    }
    return { init };
};
HomePage().init();
//# sourceMappingURL=home.js.map