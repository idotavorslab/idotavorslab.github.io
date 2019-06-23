const ResearchPage = () => {
    async function init() {
        
        console.log('ResearchPage init');
        home.empty();
        elem({id: 'page_css'}).attr({href: 'main/research/research.css'});
        let req = new Request('main/research/research.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        console.log(data);
        for (let [title, {img, text}] of dict(data).items()) {
            let article = elem({tag: "article"});
            article
                .append(
                    div({text: title, cls: "title"}),
                    div({text: text, cls: "text"}),
                )
                .css({backgroundImage: `url("main/research/${img}")`});
            home.append(article);
        }
        
        
    }
    
    
    return {init}
};
