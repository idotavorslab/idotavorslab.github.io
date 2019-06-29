const ResearchPage = () => {
    async function init(selectedIndex) {
        console.log('ResearchPage init, selectedIndex: ', selectedIndex);
        let req = new Request('main/research/research.json', { cache: "no-cache" });
        const data = await (await fetch(req)).json();
        Home.empty();
        console.log(data);
        const articles = [];
        for (let [title, { image, content }] of dict(data).items()) {
            let article = elem({ tag: "article" });
            article
                .cacheAppend({
                title: div({ text: title, cls: "title" }),
                content: div({ text: content, cls: "content" }),
            })
                .css({ backgroundImage: `linear-gradient(rgb(100,100,100), #222), url("main/research/${image}")` });
            articles.push(article);
            Home.append(article);
        }
        if (selectedIndex !== undefined) {
            const selectedArticle = articles[selectedIndex];
            selectedArticle.e.scrollIntoView({ behavior: "smooth" });
            await wait(1000);
            selectedArticle.content.addClass('highlighted');
            selectedArticle.title.addClass('highlighted');
            await wait(700);
            selectedArticle.content.removeClass('highlighted');
            selectedArticle.title.removeClass('highlighted');
        }
    }
    return { init };
};
//# sourceMappingURL=research.js.map