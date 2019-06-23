const PublicationsPage = () => {
    async function init() {
        console.log('PublicationsPage init');
        home.empty();
        elem({ id: 'page_css' }).attr({ href: 'main/publications/publications.css' });
        let req = new Request('main/publications/publications.json', { cache: "no-cache" });
        const data = await (await fetch(req)).json();
        console.log(data);
        const papers = [];
        for (let [title, { year, creds, mag, link }] of dict(data).items()) {
            let paper = elem({ tag: "paper" });
            paper
                .append(span({ text: creds, cls: "creds" }), span({ text: year, cls: "year" }), span({ text: title, cls: "title" }), span({ text: mag, cls: "mag" }), span({ text: link, cls: "link" }));
            papers.push(paper);
        }
        const papersContainer = div({ id: "papers_container" })
            .append(...papers);
        home.append(papersContainer);
    }
    return { init };
};
//# sourceMappingURL=publications.js.map