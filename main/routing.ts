declare namespace Routing {
    type Page = "home" | "research" | "people" | "publications" | "gallery" | "neuroanatomy" | "contact";
}
const Routing = (() => {
    
    function getPageObj(key: Routing.Page): typeof ResearchPage {
        switch (key) {
            case "research":
                return ResearchPage;
            case "people":
                return PeoplePage;
            case "publications":
                return PublicationsPage;
            case "gallery":
                return GalleryPage;
            case "neuroanatomy":
                return NeuroanatomyPage
            
        }
    }
    
    function pageStrings(): Routing.Page[] {
        return ["home", "research", "people", "publications", "gallery", "neuroanatomy", "contact"]
    }
    
    function route(url: Routing.Page) {
        console.log(`route("${url}")`);
        if (bool(url)) {
            if (pageStrings().includes(url)) {
                console.log('\tvalid url, calling pageObj().init()');
                if (url === "gallery")
                    Footer.attr({hidden: ''});
                else
                    Footer.removeAttr('hidden');
                const pageObj = getPageObj(url);
                pageObj().init();
                Navbar.select(Navbar[url])
            } else { // bad url, reload to homepage
                elem({tag: 'a'}).attr({href: ``}).click();
            }
        } else {
            console.log('\tempty url, calling HomePage().init()');
            HomePage().init();
        }
    }
    
    let lastPage = window.location.hash.slice(1);
    console.log(`document root, window.location: ${window.location}\ncalling route("${lastPage}")`);
    route(<Routing.Page>lastPage);
    return {route, pageStrings}
})();


/*function routeNew(url: string) {
    const split = url.split(window.location.href);
    console.log('split:', split);
    if (split[0].includes('home')) {
        elem({tag: 'a'}).attr({href: ``}).click();
    } else if (split[0] === "") {
        HomePage().init();
    } else {
        elem({tag: 'a'}).attr({href: `#${split}`}).click();
    }
}
*/


// routeNew(`${window.location}`);

/*interface Separators extends BetterHTMLElement {
    right: BetterHTMLElement,
    left: BetterHTMLElement,
}

const _separators = <Separators>elem({query: 'div.separators', children: {left: '.left', right: '.right'}});


function _linearGradient(opac_stop_1: [number, string], opac_stop_2: [number, string]) {
    return `linear-gradient(90deg, rgba(0, 0, 0, ${opac_stop_1[0]}) ${opac_stop_1[1]}, rgba(0, 0, 0, ${opac_stop_2[0]}) ${opac_stop_2[1]})`
}

function _startSeparatorAnimation() {
    
    TL.fromTo(_separators.left.e, 0.5, {backgroundImage: _linearGradient([0, '0%'], [0.15, '150%'])}, {
        backgroundImage: _linearGradient([0, '0%'], [0.75, '10%']),
    });
    TL.fromTo(_separators.right.e, 0.5, {backgroundImage: _linearGradient([0.15, '-50%'], [0, '100%'])}, {
        backgroundImage: _linearGradient([0.75, '90%'], [0, '100%']),
    });
    
}

function _killSeparatorAnimation() {
    TL.killTweensOf([_separators.left.e, _separators.right.e]);
    _separators.left.css({backgroundImage: _linearGradient([0, '0%'], [0.1, '10%'])});
    _separators.right.css({backgroundImage: _linearGradient([0.1, '90%'], [0, '100%'])});
}


*/

