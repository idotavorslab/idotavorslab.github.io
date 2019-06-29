const HomePage = () => {
    class CarouselItem {
        title: string;
        image: string;
        content: string;
        
        constructor(title: string, image: string, content: string) {
            this.title = title;
            this.image = image;
            this.content = content;
        }
    }
    
    class Carousel extends Elem {
        left: Elem;
        right: Elem;
        headline: Elem;
        content: Elem;
        items: CarouselItem[];
        currentIndex: number;
        
        constructor(elemOptions: ElemOptions, items: CarouselItem[]) {
            super(elemOptions);
            this.items = items;
            this.currentIndex = 0;
            this._switch(0);
            this.headline.on({
                pointerdown: () => {
                    console.log('headline pointerdown');
                },
                
            });
            let _buttonAnimation: AnimateOptions = {
                name: 'downAndUp',
                duration: '1000ms',
                // timingFunction: 'linear',
                // iterationCount: 1
            };
            // this.left.click(async () => {
            this.left.click(async () => {
                console.log('%cleft click', 'font-weight: 700; font-size: 15px', this);
                // this.left.animate(_buttonAnimation);
                /*this.left.addClass('animated');
                await wait(25);
                */
                this._switchLeft();
                this.left.removeClass('animated');
                window.requestAnimationFrame(time => {
                    window.requestAnimationFrame(time => {
                        this.left.addClass('animated');
                    })
                })
            });
            this.right.click(() => {
                console.log('right click');
                this.right.animate(_buttonAnimation);
                this._switchRight();
            });
        }
        
        private _switch(index: number) {
            
            this.currentIndex = index;
            if (this.currentIndex == -1)
                this.currentIndex = this.items.length - 1;
            else if (this.currentIndex == this.items.length)
                this.currentIndex = 0;
            console.log('_switch, index: ', index, 'this.currentIndex: ', this.currentIndex, 'current item: ', this.items[this.currentIndex]);
            this.content.text(this.items[this.currentIndex].content);
            this.headline.text(this.items[this.currentIndex].title);
            // document.getElementById('carousel_headline').innerText = this.items[1].title;
            // document.getElementById('carousel_headline').innerText = "Bgin";
            this.css({backgroundImage: `linear-gradient(rgb(100,100,100), #222), url("main/research/${this.items[this.currentIndex].image}")`});
        }
        
        private _switchRight() {
            this._switch(this.currentIndex + 1);
        }
        
        private _switchLeft() {
            this._switch(this.currentIndex - 1);
        }
        
    }
    
    
    async function init() {
        
        console.group('HomePage init');
        let req = new Request('main/research/research.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        console.log({data});
        
        const carouselItems = [];
        for (let [title, {image, content}] of dict(data).items()) {
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
    
    
    return {init}
};

HomePage().init();




