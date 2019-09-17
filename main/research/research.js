const ResearchPage = () => {
    async function init(selectedIndex) {
        console.log('ResearchPage init, selectedIndex: ', selectedIndex);
        const data = await fetchJson('main/research/research.json', "no-cache");
        const articles = [];
        let emptied = false;
        for (let [i, [title, { image, text, circle }]] of Object.entries(Object.entries(data))) {
            let articleCls = i % 2 == 0 ? '' : 'reverse';
            let imgCls = circle !== undefined ? 'circle' : '';
            let article = div({ cls: `article ${articleCls}` })
                .cacheAppend({
                title: elem({ tag: "h1", text: title }),
                text: paragraph({ cls: "text" }).html(text),
                img: img({ src: `main/research/${image}`, cls: imgCls })
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
            await wait(600);
            selectedArticle.title.removeClass('highlighted');
        }
    }
    return { init };
};
//# sourceMappingURL=research.js.map