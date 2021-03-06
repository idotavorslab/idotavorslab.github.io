const NeuroanatomyPage = () => {
    
    
    async function init() {
        type TNeuroanatomyData = { brains: TMap<{ text: string, link: string, dev: boolean }>, "intro-text": string };
        const {brains: brainsData, "intro-text": introText} = await fetchDict<TNeuroanatomyData>('main/neuroanatomy/neuroanatomy.json');
        const brains = [];
        for (let [title, {text, link, dev}] of Object.entries(brainsData)) {
            if (dev && !IS_GILAD)
                continue;
            let brain = div({cls: 'brain'}).append(
                div({cls: 'sketchfab-embed-wrapper'}).html(wrapSketch(title, link)),
                elem({tag: 'h2'}).text(capitalizeLine(title)),
                paragraph({cls: 'text'}).html(text),
            );
            brains.push(brain);
        }
        Home.empty().class('neuroanatomy-page').append(
            elem({tag: 'h1'}).text('Introduction'),
            div({id: 'neuroanatomy_intro'}).html(introText),
            div({id: 'brains_flex'}).append(...brains)
            // ...brains
        )
    }
    
    function wrapSketch(title: string, link: string): string {
        if (link.match(/sketchfab\.com/) === null) {
            // @ts-ignore
            return console.error("neuroanatomy.json: link didn't include 'sketchfab.com'")
        }
        
        if (link.endsWith('/')) {
            link.slice(0, link.length - 1);
        }
        
        return `<iframe src="${link}/embed?autospin=0.2&amp;preload=1" title="${title}" allow="autoplay; fullscreen; vr" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>`
    }
    
    return {init}
};

