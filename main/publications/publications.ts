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
                        title: div({text: title, cls: "paper-title"}).pointerdown(_openLink),
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
        let req = new Request('main/publications/publications.json', {cache: "no-cache"});
        const data = await (await fetch(req)).json();
        console.log('PublicationsPage data:', data);
        const papers: Paper[] = [];
        
        for (let [title, {year, creds, mag, thumbnail, link}] of dict(data).items()) {
            papers.push(new Paper(title, year, creds, mag, thumbnail, link));
        }
        
        // papers.sort((a, b) => b.year - a.year);
        
        
        const yearToPaper: TMap<[Paper]> = {};
        for (let paper of papers) {
            if (paper.year in yearToPaper) {
                yearToPaper[paper.year].push(paper);
            } else {
                yearToPaper[paper.year] = [paper];
            }
            
        }
        const yearElems: BetterHTMLElement[] = [];
        for (let year of Object.keys(yearToPaper).reverse()) { // 2019, 2018, 2016
            console.log(year);
            let yearElem = elem({tag: 'year'}).cacheAppend({
                title: div({cls: 'title-and-separator-container'})
                    .append(
                        span({cls: 'year-span'}).text(year),
                        // div({cls: 'minimize'}).text('_')
                    ),
                papers: div({cls: 'papers'})
                    .append(...yearToPaper[year].map(p => p.elem))
            });
            yearElems.push(yearElem)
        }
        
        // const papersContainer = div({id: "papers_container"})
        //     .append(...papers.map(p => p.elem));
        const papersContainer = div({id: "papers_container"})
            .append(...yearElems);
        Home.empty().append(papersContainer);
        
        
    }
    
    
    return {init}
};
// PublicationsPage().init();
