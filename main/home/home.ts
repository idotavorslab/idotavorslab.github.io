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
        image: Elem;
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
            
            this.left.click(async () => {
                // console.log('%cleft click', 'font-weight: 700; font-size: 15px', this);
                TweenLite.to(this.content.e, 0.1, {opacity: 0});
                TweenLite.to(this.headline.e, 0.1, {opacity: 0});
                
                
                TweenLite.fromTo(this.e, 0.2, {filter: 'brightness(1)'}, {
                    filter: 'brightness(0.5)',
                    ease: Power2.easeIn,
                    onStart: () => {
                    
                    },
                    onComplete: () => {
                        console.log('complete');
                        this._switchLeft();
                        TweenLite.to(this.content.e, 0.3, {opacity: 1});
                        TweenLite.to(this.headline.e, 0.1, {opacity: 1});
                        TweenLite.to(this.e, 1, {filter: 'brightness(1)'})
                    }
                })
                
                
            });
            this.right.click(() => {
                console.log('right click');
                this._switchRight();
                this.right.animate(_buttonAnimation);
            });
        }
        
        private _switch(index: number) {
            
            this.currentIndex = index;
            if (this.currentIndex == -1)
                this.currentIndex = this.items.length - 1;
            else if (this.currentIndex == this.items.length)
                this.currentIndex = 0;
            // console.log('_switch, index: ', index, 'this.currentIndex: ', this.currentIndex, 'current item: ', this.items[this.currentIndex]);
            this.content.text(this.items[this.currentIndex].content);
            this.headline.text(this.items[this.currentIndex].title);
            this.image.css({backgroundImage: `linear-gradient(rgb(100,100,100), #222), url("main/research/${this.items[this.currentIndex].image}")`});
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
    
    
    return {init}
};

HomePage().init();




