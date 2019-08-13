const PublicationsPage = () => {
    async function init() {
        
        console.log('PublicationsPage init');
        Navbar.select(Navbar.publications);
        let req = new Request('main/publications/publications.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        console.log(data);
        const papers = [];
        for (let [title, {year, creds, mag, thumbnail, link}] of dict(data).items()) {
            let paper = elem({tag: "paper"});
            
            function openLink() {
                if (link.includes('http') || link.includes('www'))
                    window.open(link);
                else // local
                    window.open(`main/publications/${link}`)
            }
            
            paper.cacheAppend({
                thumb: img({src: `main/publications/${thumbnail}`, cls: "thumbnail"}).pointerdown(openLink),
                content: div({cls: "content-div"}).cacheAppend({
                    title: div({text: title, cls: "title"}).pointerdown(openLink),
                    creds: span({text: creds, cls: "creds"}),
                    year: span({text: ` (${year})`, cls: "year"}),
                    mag: div({text: mag, cls: "mag"})
                })
                
            });
            
            papers.push(paper);
            
        }
        const papersContainer = div({id: "papers_container"})
            .append(...papers);
        Home.empty().append(papersContainer);
        
        
    }
    
    
    return {init}
};
PublicationsPage().init();
