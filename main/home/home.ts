const HomePage = () => {
    type TNewsDataItem = { title: string, date: string, content: string, links: TMap<string>, radio: BetterHTMLElement, index: number };
    type TNewsElem = BetterHTMLElement & { date: Div, title: Div, content: Div, radios: Div };
    /** The single #news>date,title,content,radios html to show selected news */
    const newsElem: TNewsElem = <TNewsElem>elem({
        query: '#news', children: {
            date: '.date',
            title: '.title',
            content: '.content',
            radios: '.radios'
        }
    });
    const newsChildren: HTMLElement[] = newsElem.children().map(c => c.e);
    
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
        readonly data: TNewsDataItem[];
        private _selected: TNewsDataItem;
        private _interval: number;
        private _userPressed: boolean = false;
        
        constructor() {
            this.data = [];
            this._selected = undefined;
            this.startAutoSwitch();
            
            
            return new Proxy(this, {
                get(target, prop: string | number | symbol, receiver: any): any {
                    if (prop in target) {
                        return target[prop];
                    }
                    const parsedInt = parseInt(<string>prop);
                    if (!isNaN(parsedInt)) {
                        return target.data[parsedInt];
                    }
                    console.warn("NewsData.constructor.proxy.get, prop not in target and parsedInt is NaN",
                        JSON.parse(JSON.stringify({target, prop})));
                    return undefined;
                }
            })
        }
        
        
        push(item: TNewsDataItem) {
            this.data.push(item);
            item.radio.pointerdown(async () => {
                this._userPressed = true;
                this.stopAutoSwitch();
                await this.switchTo(item);
            })
        }
        
        
        async switchTo(selectedItem: TNewsDataItem) {
            if (this._selected !== undefined)
                this._selected.radio.toggleClass('selected');
            
            TL.to(newsChildren, 0.1, {opacity: 0});
            await wait(25);
            
            for (let [text, link] of enumerate(selectedItem.links)) {
                selectedItem.content = selectedItem.content.replace(text, `<a href="${link}">${text}</a>`)
            }
            newsElem.date.text(bool(selectedItem.date) ? `${selectedItem.date}:` : '');
            newsElem.title.text(selectedItem.title);
            newsElem.content.html(selectedItem.content);
            selectedItem.radio.toggleClass('selected');
            
            this._selected = selectedItem;
            
            TL.to(newsChildren, 0.1, {opacity: 1});
            
        }
        
        startAutoSwitch() {
            if (this._userPressed)
                return;
            
            
            this._interval = setInterval(() => {
                let targetIndex = this._selected.index + 1;
                let targetItem = this.data[targetIndex];
                if (targetItem === undefined) {
                    targetIndex -= this.data.length;
                    targetItem = this.data[targetIndex];
                }
                this.switchTo(targetItem)
            }, 10000);
        }
        
        stopAutoSwitch() {
            clearInterval(this._interval);
        }
    }
    
    async function init() {
        newsElem.mouseover(() => newsData.stopAutoSwitch());
        newsElem.mouseout(() => newsData.startAutoSwitch());
        
        /*
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
        elem({query: "#non_news > .text"}).text(data["our lab"]);
        
        /** Keep the data from .json in an array, plus the matching radio BetterHTMLElement */
        const newsData = new NewsData();
        
        
        let i = 0;
        for (let [title, {date, content, links}] of dict(data.news).items()) {
            let item: TNewsDataItem = {title, date, content, links, radio: div({cls: 'radio'}), index: i};
            newsData.push(item);
            if (i === 0) {
                newsData.switchTo(item);
            }
            
            newsElem.radios.append(newsData[i].radio);
            i++;
            
        }
        
        
    }
    
    
    return {init}
};
HomePage().init();




