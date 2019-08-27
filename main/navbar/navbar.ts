type Page = "research" | "people" | "publications" | "gallery" | "contact";

class Navbar extends BetterHTMLElement {
    home: Img;
    research: Div;
    people: Div;
    publications: Div;
    gallery: Div;
    contact: Div;
    tau: Img;
    
    constructor({query, children}) {
        super({query, children});
        this.home.pointerdown(() => {
            _startSeparatorAnimation();
            window.location.reload();
        });
        
        for (let k of <Page[]>["research", "people", "publications", "gallery", "contact"]) {
            this[k]
                .pointerdown(() => {
                    console.log(`this[k].pointerdown, k: ${k}`);
                    this._gotoPage(k);
                })
        }
    }
    
    private static _getPageObj(key: Page): typeof ResearchPage {
        switch (key) {
            case "research":
                return ResearchPage;
            case "people":
                return PeoplePage;
            case "publications":
                return PublicationsPage;
            case "gallery":
                return GalleryPage;
            
        }
    }
    
    private async _gotoPage(pageName: Page) {
        console.log(`navbar.ts.Navbar._gotoPage(${pageName})`);
        DocumentElem.allOff();
        
        _startSeparatorAnimation();
        const pageObj = Navbar._getPageObj(pageName);
        this._select(this[pageName]);
        await pageObj().init();
        _killSeparatorAnimation();
    }
    
    private _select(child: Div) {
        for (let k of [this.research, this.people, this.publications, this.gallery, this.contact]) {
            k.toggleClass('selected', k === child);
        }
    }
    
    
}

const navbar = new Navbar({
    query: 'div#navbar',
    children: {
        home: '.home',
        research: '.research',
        people: '.people',
        publications: '.publications',
        gallery: '.gallery',
        contact: '.contact',
        tau: '.tau',
    }
});


interface Separators extends BetterHTMLElement {
    right: BetterHTMLElement,
    left: BetterHTMLElement,
}

const _separators = <Separators>elem({query: 'div#separators', children: {left: '.left', right: '.right'}});


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

