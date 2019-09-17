const ResearchPage = () => {
    async function init(selectedIndex) {
        console.log('ResearchPage init, selectedIndex: ', selectedIndex);
        const data = await fetchJson('main/research/research.json', "no-cache");
        const articles = [];
        let emptied = false;
        for (let [title, { image, text }] of dict(data).items()) {
            let article = div({ cls: "article" });
            article
                .cacheAppend({
                title: elem({ tag: "h1", text: title }),
                contentFlex: div({ cls: 'content-flex' })
                    .append(paragraph({ text, cls: "text" }), img({ src: `main/research/${image}` }))
            });
            articles.push(article);
            if (!emptied) {
                Home.empty();
                emptied = true;
            }
            Home.append(article);
        }
        if (selectedIndex !== undefined) {
            const selectedArticle = articles[selectedIndex];
            const howFar = selectedIndex / articles.length;
            selectedArticle.e.scrollIntoView({ behavior: "smooth", block: "center" });
            await wait(howFar * 1000);
            selectedArticle.title.addClass('highlighted');
            await wait(1500);
            selectedArticle.title.removeClass('highlighted');
        }
    }
    return { init };
};
//# sourceMappingURL=research.js.map