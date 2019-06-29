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
        
        private _switch(index: number) {
            
            this.currentIndex = index;
            if (this.currentIndex == -1)
                this.currentIndex = this.items.length - 1;
            else if (this.currentIndex == this.items.length)
                this.currentIndex = 0;
            console.log('this.currentIndex: ', this.currentIndex);
            this.css({backgroundImage: `linear-gradient(rgb(100,100,100), #222), url("main/research/${this.items[this.currentIndex].image}")`});
            this.headline.text(this.items[this.currentIndex].title);
            this.content.text(this.items[this.currentIndex].content);
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
            query: "carousel", children: {
                left: '.left',
                right: '.right',
                content: 'content',
                headline: 'headline'
            }
        }, carouselItems);
        console.log(carousel);
        
        
        console.groupEnd();
    }
    
    
    return {init}
};

HomePage().init();




