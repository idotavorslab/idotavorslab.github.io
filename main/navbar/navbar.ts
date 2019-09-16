type Page = "home" | "research" | "people" | "publications" | "gallery" | "contact";

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
        // this.home.pointerdown(() => {
        //     // _startSeparatorAnimation();
        //     // @ts-ignore
        //     window.location = window.location.origin;
        // });
        
        for (let k of <Page[]>["home", "research", "people", "publications", "gallery", "contact"]) {
            this[k].pointerdown(() => {
                let href = k === "home" ? '' : `#${k}`;
                console.log(`navbar ${k} pointerdown, clicking fake <a href="${href}">`);
                elem({tag: 'a'}).attr({href}).click();
            })
        }
    }
    
    
    /*async gotoPageOLD(pageName: Page) {
        console.log(`navbar.ts.Navbar.gotoPage(${pageName})`);
        DocumentElem.allOff();
        // const bottomSeparators = document.querySelectorAll(".separators")[1];
        // if (bottomSeparators)
        //     bottomSeparators.remove();
        
        const logos = elem({id: 'logos'});
        if (logos.e)
            logos.remove();
        // _startSeparatorAnimation();
        const pageObj = Navbar.getPageObj(pageName);
        this._select(this[pageName]);
        history.pushState(null, null, `#${pageName}`);
        // history.replaceState()
        await pageObj().init();
        // _killSeparatorAnimation();
    }
    */
    
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

function getPageObj(key: Page): typeof ResearchPage {
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

function route(url: Page) {
    console.log(`route("${url}")`);
    if (bool(url)) {
        if (["research", "people", "publications", "gallery", "contact"].includes(url)) {
            console.log('\tvalid url, calling pageObj().init()');
            const pageObj = getPageObj(url);
            pageObj().init();
        } else { // bad url, reload to homepage
            elem({tag: 'a'}).attr({href: ``}).click();
        }
    } else {
        console.log('\tempty url, calling HomePage().init()');
        HomePage().init();
    }
}

WindowElem.on({
    scroll: (event: Event) => {
        if (window.scrollY > 0) {
            navbar.removeClass('box-shadow')
        } else {
            navbar.addClass('box-shadow')
            
        }
        
    },
    hashchange: (event: HashChangeEvent) => {
        // called on navbar click, backbutton click
        const newURL = event.newURL.replace(window.location.origin, "").slice(1).replace('#', '');
        console.log('hash change', event, '\nnewURL:', newURL);
        if (!bool(newURL)) {
            // this prevents the user pressing back to homepage, then route calls HomePage().init() instead of reloading
            elem({tag: 'a'}).attr({href: ``}).click()
        } else {
            route(newURL);
        }
        
        
    }
});
let lastPage = window.location.hash.slice(1);
console.log(`document root, calling route("${lastPage}")`);
route(lastPage);

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

