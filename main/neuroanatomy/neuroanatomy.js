const NeuroanatomyPage = () => {
    async function init() {
        const data = await fetchJson('main/neuroanatomy/neuroanatomy.json', "no-cache");
        const brains = [];
        for (let { title, text, link } of data) {
            console.log(JSON.parstr({ title, text, link }));
            let brain = div({ cls: 'brain' }).append(elem({ tag: 'h1' }).text(title), paragraph({ cls: 'text' }).html(text), div({ cls: 'sketchfab-embed-wrapper' }).html(wrapSketch(title, link)));
            brains.push(brain);
        }
        Home.empty().append(...brains);
    }
    function wrapSketch(title, link) {
        if (link.match(/sketchfab\.com/) === null) {
            return console.error("neuroanatomy.json: link didn't include 'sketchfab.com'");
        }
        if (link.endsWith('/')) {
            link.slice(0, link.length - 1);
        }
        return `<iframe src="${link}/embed?autospin=0.2&amp;preload=1" title="${title}" frameborder="0" allow="autoplay; fullscreen; vr" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>`;
    }
    return { init };
};
//# sourceMappingURL=neuroanatomy.js.map