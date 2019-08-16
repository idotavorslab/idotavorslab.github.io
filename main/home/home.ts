const HomePage = () => {
    type NewsElem = BetterHTMLElement & { date: Div, title: Div, content: Div, radios: Div };
    
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
        const newsElem: NewsElem = <NewsElem>elem({
            query: '#news', children: {
                date: '.date',
                title: '.title',
                content: '.content',
                radios: '.radios'
            }
        });
        
        let i = 0;
        
        function popuplateNews(date, title, content, radio: BetterHTMLElement) {
            newsElem.date.text(`${date}:`);
            newsElem.title.text(title);
            newsElem.content.html(content);
            radio.toggleClass('selected');
        }
        
        
        const newsObjs: { title: string, date: string, content: string, radio: BetterHTMLElement }[] = [];
        let lastSelectedRadioIndex = 0;
        for (let [title, {date, content}] of dict(data.news).items()) {
            let radio = elem({tag: 'radio'});
            newsObjs.push({title, date, content, radio});
            if (i === 0) {
                popuplateNews(date, title, content, radio);
            }
            radio.pointerdown(async () => {
                newsObjs[lastSelectedRadioIndex].radio.toggleClass('selected');
                TL.to(newsChildren, 0.1, {opacity: 0,});
                await wait(25);
                popuplateNews(date, title, content, radio);
                TL.to(newsChildren, 0.1, {opacity: 1});
                lastSelectedRadioIndex = radioElems.indexOf(radio);
            });
            newsElem.radios.append(radio);
            i++;
            
        }
        const radioElems = newsObjs.map(news => news.radio);
        const newsChildren = newsElem.children().map(c => c.e);
        setInterval(() => {
        
        }, 7000)
    }
    
    
    return {init}
};

HomePage().init();




