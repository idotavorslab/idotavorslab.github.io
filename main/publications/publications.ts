const PublicationsPage = () => {
    async function init() {
        
        console.log('PublicationsPage init');
        home.empty();
        elem({id: 'page_css'}).attr({href: 'main/publications/publications.css'});
        let req = new Request('main/publications/publications.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        console.log(data);
        const papers = [];
        for (let [title, {year, creds, mag, link}] of dict(data).items()) {
            let paper = elem({tag: "paper"});
            paper
                .append(
                    div({text: creds, cls: "creds"}),
                    div({text: year, cls: "year"}),
                    div({text: title, cls: "title"}),
                    div({text: mag, cls: "mag"}),
                    elem({tag: 'a', text: 'LINK'}).attr({href: link}),
                );
            papers.push(paper);
            
        }
        const papersContainer = div({id: "papers_container"})
            .append(...papers);
        home.append(papersContainer);
        
        
    }
    
    
    return {init}
};
