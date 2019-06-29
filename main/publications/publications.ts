const PublicationsPage = () => {
    async function init() {
        
        console.log('PublicationsPage init');
        let req = new Request('main/publications/publications.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        console.log(data);
        const papers = [];
        for (let [title, {year, creds, mag, link}] of dict(data).items()) {
            let paper = elem({tag: "paper"});
            paper.cacheAppend({
                title: div({text: title, cls: "title"}),
                creds: span({text: creds, cls: "creds"}),
                year: span({text: ` (${year})`, cls: "year"}),
                mag: div({text: mag, cls: "mag"}),
            }).pointerdown(() => {
                window.open(link)
            });
            
            papers.push(paper);
            
        }
        const papersContainer = div({id: "papers_container"})
            .append(...papers);
        Home.empty().append(papersContainer);
        
        
    }
    
    
    return {init}
};
