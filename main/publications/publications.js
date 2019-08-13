const PublicationsPage = () => {
    class Paper {
        constructor(title, year, creds, mag, thumbnail, link) {
            function _openLink() {
                if (link.includes('http') || link.includes('www'))
                    window.open(link);
                else
                    window.open(`main/publications/${link}`);
            }
            this.elem = elem({ tag: "paper" })
                .cacheAppend({
                thumb: img({ src: `main/publications/${thumbnail}`, cls: "thumbnail" }).pointerdown(_openLink),
                content: div({ cls: "content-div" }).cacheAppend({
                    title: div({ text: title, cls: "title" }).pointerdown(_openLink),
                    creds: span({ text: creds, cls: "creds" }),
                    year: span({ text: ` (${year})`, cls: "year" }),
                    mag: div({ text: mag, cls: "mag" }).pointerdown(_openLink)
                }),
                pdf: div({ cls: 'pdf-div' })
                    .pointerdown(_openLink)
                    .text(link.split('.').reverse()[0].toUpperCase())
            });
            this.year = year;
        }
    }
    async function init() {
        console.log('PublicationsPage init');
        Navbar.select(Navbar.publications);
        let req = new Request('main/publications/publications.json', { cache: "no-cache" });
        const data = await (await fetch(req)).json();
        console.log('PublicationsPage data:', data);
        const papers = [];
        for (let [title, { year, creds, mag, thumbnail, link }] of dict(data).items()) {
            papers.push(new Paper(title, year, creds, mag, thumbnail, link));
        }
        const yearToPaper = {};
        for (let paper of papers) {
            if (paper.year in yearToPaper) {
                yearToPaper[paper.year].push(paper);
            }
            else {
                yearToPaper[paper.year] = [paper];
            }
        }
        const yearElems = [];
        for (let year of Object.keys(yearToPaper).reverse()) {
            console.log(year);
            let yearElem = elem({ tag: 'year' }).cacheAppend({
                title: div({ cls: 'title' }).text(year),
                papers: div({ cls: 'papers' }).append(...yearToPaper[year].map(p => p.elem))
            });
            yearElems.push(yearElem);
        }
        const papersContainer = div({ id: "papers_container" })
            .append(...yearElems);
        Home.empty().append(papersContainer);
    }
    return { init };
};
PublicationsPage().init();
//# sourceMappingURL=publications.js.map