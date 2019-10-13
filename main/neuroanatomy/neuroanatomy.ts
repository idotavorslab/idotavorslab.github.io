const NeuroanatomyPage = () => {
    
    
    async function init() {
        // const data: { "intro-text": string, brains: TMap<{ title: string, text: string, link: string }> } = await fetchJson('main/neuroanatomy/neuroanatomy.json');
        type TNeuroanatomyData = { brains: TMap<{ text: string, link: string }>, "intro-text": string };
        const {brains: brainsData, "intro-text": introText} = await fetchDict<TNeuroanatomyData>('main/neuroanatomy/neuroanatomy.json');
        // const {brains: brainsData, "intro-text": introText} = data;
        const brains = [];
        for (let [title, {text, link}] of Object.entries(brainsData)) {
            // console.log(JSON.parstr({title, text, link}));
            let brain = div({cls: 'brain'}).append(
                div({cls: 'sketchfab-embed-wrapper'}).html(wrapSketch(title, link)),
                elem({tag: 'h2'}).text(title),
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
        
        return `<iframe src="${link}/embed?autospin=0.2&amp;preload=1" title="${title}" frameborder="0" allow="autoplay; fullscreen; vr" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>`
    }
    
    return {init}
};

