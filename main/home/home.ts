const HomePage = () => {
    type newsDataItem = { title: string, date: string, content: string, radio: BetterHTMLElement };
    type NewsElem = BetterHTMLElement & { date: Div, title: Div, content: Div, radios: Div };
    /** The single #news>date,title,content,radios html to show selected news */
    const newsElem: NewsElem = <NewsElem>elem({
        query: '#news', children: {
            date: '.date',
            title: '.title',
            content: '.content',
            radios: '.radios'
        }
    });
    const newsChildren = newsElem.children().map(c => c.e);
    
    /*class CarouselItem {
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
    */
    class NewsData {
        readonly data: newsDataItem[];
        private _selected: newsDataItem;
        
        constructor() {
            this.data = [];
            return new Proxy(this, {
                get(target, prop: string | number | symbol, receiver: any): any {
                    if (prop in target) {
                        return target[prop];
                    }
                    const parsedInt = parseInt(<string>prop);
                    if (!isNaN(parsedInt)) {
                        return target.data[parsedInt];
                    }
                    console.error("NewsData.constructor.proxy.get, prop not in target and parsedInt is NaN",
                        JSON.parse(JSON.stringify({target, prop})));
                    
                }
            })
        }
        
        select(index: number) {
            const newsDataItem = this[index];
            newsElem.date.text(`${newsDataItem.date}:`);
            newsElem.title.text(newsDataItem.title);
            newsElem.content.html(newsDataItem.content);
            newsDataItem.radio.toggleClass('selected');
            this._selected = newsDataItem;
        }
        
        
        push(item: newsDataItem) {
            this.data.push(item);
            const itemIndex = this.data.length - 1;
            item.radio.pointerdown(async () => {
                this._selected.radio.toggleClass('selected');
                TL.to(newsChildren, 0.1, {opacity: 0,});
                await wait(25);
                this.select(itemIndex);
                TL.to(newsChildren, 0.1, {opacity: 1});
            })
        }
        
        
    }
    
    async function init() {
        
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
        
        
        /** Keep the data from .json in an array, plus the matching radio BetterHTMLElement */
        const newsData = new NewsData();
        
        
        let i = 0;
        for (let [title, {date, content}] of dict(data.news).items()) {
            newsData.push({title, date, content, radio: elem({tag: 'radio'})});
            if (i === 0) {
                newsData.select(0);
            }
            
            newsElem.radios.append(newsData[i].radio);
            i++;
            
        }
        
        setInterval(() => {
        
        }, 7000)
    }
    
    
    return {init}
};

HomePage().init();




