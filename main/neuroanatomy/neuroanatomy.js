const NeuroanatomyPage = () => {
    async function init() {
        const { brains: brainsData, "intro-text": introText } = await fetchDict('main/neuroanatomy/neuroanatomy.json');
        const brains = [];
        for (let [title, { text, link }] of Object.entries(brainsData)) {
            let brain = div({ cls: 'brain' }).append(elem({ tag: 'h2' }).text(title), div({ cls: 'sketchfab-embed-wrapper' }).html(wrapSketch(title, link)), paragraph({ cls: 'text' }).html(text));
            brains.push(brain);
        }
        Home.empty().class('neuroanatomy-page').append(elem({ tag: 'h1' }).text('Introduction'), div({ id: 'neuroanatomy_intro' }).html(introText), div({ id: 'brains_flex' }).append(...brains));
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
