const HomePage = () => {
    class CarouselItem {
        title: string;
        image: string;
        text: string;
        
        constructor(title: string, image: string, text: string) {
            this.title = title;
            this.image = image;
            this.text = text;
        }
    }
    
    interface Carousel extends Elem {
        left: Elem;
        right: Elem;
        headline: Elem;
    }
    
    const carouselItems: CarouselItem[] = [];
    const carousel: Carousel = <Carousel>elem({
        query: "carousel", children: {
            left: '.left',
            right: '.right',
            headline: 'headline'
        }
    });
    console.log(carousel);
    carousel.headline.on({
        pointerdown: () => {
            console.log('headline pointerdown');
        },
        
    });
    carousel.left.on({
        pointerdown: () => {
            console.log('left pointerdown');
            carousel.left.animate({
                name: 'downAndUp',
                duration: '25ms',
                timingFunction: 'linear',
                iterationCount: 1
            });
        },
        
    });
    carousel.right.on({
        pointerdown: () => {
            console.log('right pointerdown');
        },
        
    });
    
    async function init() {
        
        console.group('HomePage init');
        let req = new Request('main/research/research.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        console.log(data);
        for (let [title, {image, text}] of dict(data).items()) {
            let item = new CarouselItem(title, image, text);
            carouselItems.push(item);
        }
        carousel.css({backgroundImage: `linear-gradient(#999, #888), url("main/research/${carouselItems[0].image}")`});
        carousel.headline.text(carouselItems[0].title);
        console.log(carouselItems);
        
        
        console.groupEnd();
    }
    
    
    return {init}
};

HomePage().init();




