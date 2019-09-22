const NeuroanatomyPage = () => {
    
    
    async function init() {
        const data: { title: string, text: string, link: string }[] = await fetchJson('main/neuroanatomy/neuroanatomy.json', "no-cache");
        const brains = [];
        for (let {title, text, link} of data) {
            console.log(JSON.parstr({title, text, link}));
            let brain = div({cls: 'brain'}).append(
                elem({tag: 'h1'}).text(title),
                div({cls: 'sketchfab-embed-wrapper'}).html(wrapSketch(title, link))
            );
            brains.push(brain);
        }
        Home.empty().append(...brains)
    }
    
    function wrapSketch(title: string, link: string): string {
        if (link.match(/sketchfab\.com/) === null) {
            // @ts-ignore
            return console.error("neuroanatomy.json: link didn't include 'sketchfab.com'")
        }
        
        if (link.endsWith('/')) {
            link.slice(0, link.length - 1);
        }
        
        return `<iframe src="${link}/embed?autospin=0.2&amp;preload=1" title="${title}" width="640" height="480" frameborder="0" allow="autoplay; fullscreen; vr" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>`
    }
    
    return {init}
};

