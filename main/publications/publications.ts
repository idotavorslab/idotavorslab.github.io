const PublicationsPage = () => {
    class Paper {
        elem: BetterHTMLElement;
        year: number;
        
        constructor(title: string, year: number, creds: string, mag: string, thumbnail: string, link: string) {
            function _openLink() {
                if (link.includes('http') || link.includes('www'))
                    window.open(link);
                else // local
                    window.open(`main/publications/${link}`)
            }
            
            this.elem = elem({tag: "paper"})
                .cacheAppend({
                    thumb: img({src: `main/publications/${thumbnail}`, cls: "thumbnail"}).pointerdown(_openLink),
                    content: div({cls: "content-div"}).cacheAppend({
                        title: div({text: title, cls: "title"}).pointerdown(_openLink),
                        creds: span({text: creds, cls: "creds"}),
                        year: span({text: ` (${year})`, cls: "year"}),
                        mag: div({text: mag, cls: "mag"}).pointerdown(_openLink)
                    }),
                    pdf: div({cls: 'pdf-div'})
                        .pointerdown(_openLink)
                        .text(link.split('.').reverse()[0].toUpperCase()) // ext
                    
                });
            this.year = year;
        }
    }
    
    async function init() {
        
        console.log('PublicationsPage init');
        Navbar.select(Navbar.publications);
        let req = new Request('main/publications/publications.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        console.log('PublicationsPage data:', data);
        const papers: Paper[] = [];
        
        for (let [title, {year, creds, mag, thumbnail, link}] of dict(data).items()) {
            papers.push(new Paper(title, year, creds, mag, thumbnail, link));
        }
        
        // papers.sort((a, b) => b.year - a.year);
        
        
        const years: TMap<[Paper]> = {};
        for (let paper of papers) {
            if (paper.year in years) {
                years[paper.year].push(paper);
            } else {
                years[paper.year] = [paper];
            }
            
            
        }
        const papersContainer = div({id: "papers_container"})
            .append(...papers.map(p => p.elem));
        Home.empty().append(papersContainer);
        
        
    }
    
    
    return {init}
};
PublicationsPage().init();
