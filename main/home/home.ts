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
    
    class Carousel extends BetterHTMLElement {
        left: BetterHTMLElement;
        right: BetterHTMLElement;
        headline: BetterHTMLElement;
        content: BetterHTMLElement;
        items: CarouselItem[];
        image: BetterHTMLElement;
        currentIndex: number;
        
        constructor(elemOptions: ElemOptions, items: CarouselItem[]) {
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
        
        private _switch(to?: 'right' | 'left') {
            TL.to([this.content.e, this.headline.e], 0.1, {opacity: 0});
            TL.fromTo(this.e, 0.2, {opacity: 1}, {
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
                    this.image.css({backgroundImage: `linear-gradient(90deg, rgba(255, 255, 255,1) 40%, rgba(255,255,255,0)), url("main/research/${this.items[this.currentIndex].image}")`});
                    TL.to([this.content.e, this.headline.e], 0.3, {opacity: 1});
                    TL.to(this.e, 1, {opacity: 1})
                }
            });
            
            
        }
        
        
    }
    
    
    async function init() {
        
        console.group('HomePage init');
        /*const data = await fetchJson('main/research/research.json', "no-cache");
        console.log('data', data);
        
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
        */
        const data = await fetchJson('main/home/home.json', "no-cache");
        const news = elem({
            query: '#news', children: {
                date: '.date',
                title: '.title',
                content: '.content',
                radios: '.radios'
            }
        });
        // console.log('news', news);
        // const radiosContainer = elem({query: '.radios'});
        // console.log(enumerate(dict(data.news).items()));
        const radioItems = [];
        for (let [i, [title, {date, content}]] of enumerate(dict(data.news).items())) {
            console.log({i, title, date, content});
            radioItems.push(elem({tag: 'radio'}))
        }
        console.groupEnd();
    }
    
    
    return {init}
};

HomePage().init();




