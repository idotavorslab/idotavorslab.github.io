const NeuroanatomyPage = () => {
    async function init() {
        const data = await fetchJson('main/neuroanatomy/neuroanatomy.json', "no-cache");
        const brains = [];
        for (let [title, url] of Object.entries(data)) {
            let brain = div({ cls: 'brain' }).append(elem({ tag: 'h1' }).text(title), div({ cls: 'sketchfab-embed-wrapper' }).html(wrapSketch(title, url)));
            brains.push(brain);
        }
        Home.empty().append(...brains);
    }
    function wrapSketch(title, url) {
        if (url.match(/sketchfab\.com/) === null) {
            return console.error("neuroanatomy.json: url didn't include 'sketchfab.com'");
        }
        if (url.endsWith('/')) {
            url.slice(0, url.length - 1);
        }
        return `<iframe src="${url}/embed?autospin=0.2&amp;preload=1" title="${title}" width="640" height="480" frameborder="0" allow="autoplay; fullscreen; vr" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>`;
    }
    return { init };
};
//# sourceMappingURL=neuroanatomy.js.map