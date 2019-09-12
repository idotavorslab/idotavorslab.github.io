const PublicationsPage = () => {
    class Publication {
        constructor(title, year, creds, mag, thumbnail, link) {
            function _openLink() {
                if (link.includes('http') || link.includes('www'))
                    window.open(link);
                else
                    window.open(`main/publications/${link}`);
            }
            function _getPdfText(_link) {
                const ext = _link.split('.').reverse()[0].toLowerCase();
                if (ext === "pdf")
                    return ext;
                return "↗";
            }
            this.elem = elem({ tag: "publication" })
                .cacheAppend({
                thumb: img({ src: `main/publications/${thumbnail}`, cls: "thumbnail" }),
                content: div({ cls: "content-div" }).cacheAppend({
                    title: div({ text: title, cls: "publication-title" }),
                    creds: span({ text: creds, cls: "creds" }),
                    year: span({ text: ` (${year})`, cls: "year" }),
                    mag: div({ text: mag, cls: "mag" }),
                }),
                pdf: div({ cls: 'pdf-div' })
                    .text(_getPdfText(link))
            }).pointerdown(_openLink);
            this.year = year;
        }
    }
    async function init() {
        console.log('PublicationsPage init');
        const { selected: selectedData, publications: publicationsData } = await fetchJson('main/publications/publications.json', "no-cache");
        console.log('PublicationsPage data:', JSON.parstr({ selectedData, publicationsData }));
        const publications = [];
        const selected = [];
        for (let title of selectedData) {
            let { year, creds, mag, thumbnail, link } = publicationsData[title];
            selected.push(new Publication(title, year, creds, mag, thumbnail, link));
        }
        for (let [title, { year, creds, mag, thumbnail, link }] of dict(publicationsData).items()) {
            publications.push(new Publication(title, year, creds, mag, thumbnail, link));
        }
        const yearToPublication = {};
        for (let publication of publications) {
            if (publication.year in yearToPublication) {
                yearToPublication[publication.year].push(publication);
            }
            else {
                yearToPublication[publication.year] = [publication];
            }
        }
        const years = [];
        const selectedPublicationsElem = div({ cls: 'year' }).append(div({ cls: 'title-and-minimize-flex' }).append(span({ cls: 'year-title' }).text('Selected Publications')));
        for (let publication of selected) {
            selectedPublicationsElem.append(publication.elem);
        }
        years.push(selectedPublicationsElem);
        for (let year of Object.keys(yearToPublication).reverse()) {
            years.push(div({ cls: 'year' }).append(div({ cls: 'title-and-minimize-flex' }).append(span({ cls: 'year-title' }).text(year)), ...yearToPublication[year].map(p => p.elem)));
        }
        const publicationsContainer = div({ id: "publications_container" }).append(...years);
        Home.empty().append(publicationsContainer);
    }
    return { init };
};
PublicationsPage().init();
//# sourceMappingURL=publications.js.map