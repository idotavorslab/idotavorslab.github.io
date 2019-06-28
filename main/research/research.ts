const ResearchPage = () => {
    async function init() {
        
        console.log('ResearchPage init');
        let req = new Request('main/research/research.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        Home.empty();
        console.log(data);
        for (let [title, {image, text}] of dict(data).items()) {
            let article = elem({tag: "article"});
            article
                .append(
                    div({text: title, cls: "title"}),
                    div({text: text, cls: "text"}),
                )
                .css({backgroundImage: `url("main/research/${image}")`});
            Home.append(article);
        }
        
        
    }
    
    
    return {init}
};
