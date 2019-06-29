const ResearchPage = () => {
    async function init() {
        
        console.log('ResearchPage init');
        let req = new Request('main/research/research.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        Home.empty();
        console.log(data);
        for (let [title, {image, content}] of dict(data).items()) {
            let article = elem({tag: "article"});
            article
                .append(
                    div({text: title, cls: "title"}),
                    div({text: content, cls: "content"}),
                )
                .css({backgroundImage: `url("main/research/${image}")`});
            Home.append(article);
        }
        
        
    }
    
    
    return {init}
};
