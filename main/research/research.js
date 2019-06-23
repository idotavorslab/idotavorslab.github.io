const ResearchPage = () => {
    async function sayHi() {
        console.log('hi from ResearchPage');
        let myRequest = new Request('main/research/research.json', { cache: "no-cache" });
        const data = await (await fetch(myRequest)).json();
        console.log(data);
        home.empty();
        elem({ id: 'page_css' }).attr({ href: 'main/research/research.css' });
        for (let [title, { img, text }] of dict(data).items()) {
            let article = elem({ tag: "article" });
            article
                .append(div({ text: title, cls: "title" }), div({ text, cls: "text" }))
                .css({ backgroundImage: `url("main/research/${img}")` });
            home.append(article);
        }
    }
    return { sayHi };
};
//# sourceMappingURL=research.js.map