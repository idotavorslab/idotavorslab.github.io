const HomePage = () => {
    async function init() {
        console.log('HomePage init');
        Home.empty();
        elem({ id: 'page_css' }).attr({ href: 'main/home/home.css' });
        let req = new Request('main/home/home.json', { cache: "no-cache" });
        const data = await (await fetch(req)).json();
        console.log(data);
        for (let [title, { image, text }] of dict(data).items()) {
            let article = elem({ tag: "article" });
            article
                .append(div({ text: title, cls: "title" }), div({ text: text, cls: "text" }))
                .css({ backgroundImage: `url("main/home/${image}")` });
            Home.append(article);
        }
    }
    return { init };
};
const carousel = elem({
    query: "body > main > home > carousel", children: {
        left: '.left',
        right: '.right'
    }
});
console.log(carousel);
//# sourceMappingURL=home.js.map