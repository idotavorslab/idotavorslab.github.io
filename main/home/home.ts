const HomePage = () => {
    async function init() {
        
        console.log('HomePage init');
        home.empty();
        elem({id: 'page_css'}).attr({href: 'main/home/home.css'});
        let req = new Request('main/home/home.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        console.log(data);
        for (let [title, {image, text}] of dict(data).items()) {
            let article = elem({tag: "article"});
            article
                .append(
                    div({text: title, cls: "title"}),
                    div({text: text, cls: "text"}),
                )
                .css({backgroundImage: `url("main/home/${image}")`});
            home.append(article);
        }
        
        
    }
    
    
    return {init}
};

const carousel = elem({
    query: "body > main > home > carousel", children: {
        left: '.left',
        right: '.right'
    }
});
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


