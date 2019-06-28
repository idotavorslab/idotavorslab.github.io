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
    
    async function init() {
        
        console.log('HomePage init');
        let req = new Request('main/research/research.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        console.log(data);
        for (let [title, {image, text}] of dict(data).items()) {
            let item = new CarouselItem(title, image, text);
            carouselItems.push(item);
        }
        carousel.css({backgroundImage: `url("main/research/${carouselItems[0].image}")`});
        carousel.headline.text(carouselItems[0].title);
        console.log(carouselItems);
        
        
    }
    
    
    return {init}
};

HomePage().init();
/*carousel.on({
    pointerdown: () => {
        console.log(carousel.children());
    },
    mouseover: () => {
        buttonLeft.css({opacity: 1});
        buttonRight.css({opacity: 1});
    },
    mouseout: () => {
        buttonLeft.css({opacity: 0});
        buttonRight.css({opacity: 0});
    }
});
*/


