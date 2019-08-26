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
                thumb: img({ src: `main/publications/${thumbnail}`, cls: "thumbnail" }),
                content: div({ cls: "content-div" }).cacheAppend({
                    title: div({ text: title, cls: "paper-title" }),
                    creds: span({ text: creds, cls: "creds" }),
                    year: span({ text: ` (${year})`, cls: "year" }),
                    mag: div({ text: mag, cls: "mag" }),
                }),
                pdf: div({ cls: 'pdf-div' })
                    .text(link.split('.').reverse()[0].toUpperCase())
            }).pointerdown(_openLink);
            this.year = year;
        }
    }
    async function init() {
        console.log('PublicationsPage init');
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
                papers: div({ cls: 'papers' })
                    .append(div({ cls: 'title-and-minimize-flex' })
                    .append(span({ cls: 'year-title' }).text(year), div({ cls: 'minimize' }).text('_')), ...yearToPaper[year].map(p => p.elem))
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