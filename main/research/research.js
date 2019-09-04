const ResearchPage = () => {
    async function init(selectedIndex) {
        console.log('ResearchPage init, selectedIndex: ', selectedIndex);
        const data = await fetchJson('main/research/research.json', "no-cache");
        console.log('ResearchPage data', data);
        const articles = [];
        let emptied = false;
        for (let [title, { image, content }] of dict(data).items()) {
            let article = div({ cls: "article" });
            article
                .cacheAppend({
                title: div({ text: title, cls: "title" }),
                content: div({ text: content, cls: "content" }),
            })
                .css({
                backgroundImage: `linear-gradient(90deg, rgba(255, 255, 255,1) 40%, rgba(255,255,255,0)),
                                        url("main/research/${image}")`
            });
            articles.push(article);
            if (!emptied) {
                Home.empty();
                emptied = true;
            }
            Home.append(article);
        }
        console.log('ResearchPage done for loop');
        if (selectedIndex !== undefined) {
            const selectedArticle = articles[selectedIndex];
            const howFar = selectedIndex / articles.length;
            selectedArticle.e.scrollIntoView({ behavior: "smooth" });
            await wait(howFar * 1000);
            selectedArticle.title.addClass('highlighted');
            await wait(1500);
            selectedArticle.title.removeClass('highlighted');
        }
    }
    return { init };
};
ResearchPage().init();
//# sourceMappingURL=research.js.map