/*type TNavbarDivChild =
    INavbar["research"]
    | INavbar["people"]
    | INavbar["publications"]
    | INavbar["gallery"]
    | INavbar["contact"]

interface INavbar extends BetterHTMLElement {
    home: Img,
    research: Div,
    people: Div,
    publications: Div,
    gallery: Div,
    contact: Div,
    tau: Img,
    select: (child: TNavbarDivChild) => void
}
*/

// const Navbar = <INavbar>elem({
//     query: 'navbar',
//     children: {
//         home: '.home',
//         research: '.research',
//         people: '.people',
//         publications: '.publications',
//         gallery: '.gallery',
//         contact: '.contact',
//         tau: '.tau',
//     }
// });
class Navbar extends BetterHTMLElement {
    home: Img;
    research: Div;
    people: Div;
    publications: Div;
    gallery: Div;
    contact: Div;
    tau: Img;
    _pageNameObjMap: { research: () => { init: (selectedIndex?: number) => Promise<void>; }; people: () => { init: () => Promise<void>; }; publications: () => { init: () => Promise<void>; }; gallery: () => { init: () => Promise<void>; }; };
    
    constructor({query, children}) {
        super({query, children});
        this.home.pointerdown(() => {
            _startSeparatorAnimation();
            window.location.reload();
        });
        this._pageNameObjMap = {
            research: ResearchPage,
            people: PeoplePage,
            publications: PublicationsPage,
            gallery: GalleryPage
        };
        for (let k of ["research", "people", "publications", "gallery", "contact"]) {
            this[k].pointerdown(() => {
                // @ts-ignore
                this._gotoPage(k);
            });
        }
    }
    
    private async _gotoPage(pageName: "research" | "people" | "publications" | "gallery" | "contact") {
        _startSeparatorAnimation();
        const pageObj = this._pageNameObjMap[pageName];
        this._select(pageObj);
        await pageObj().init();
        _killSeparatorAnimation();
    }
    
    private _select(child: Div) {
        for (let k of [this.research, this.people, this.publications, this.gallery, this.contact])
            k.toggleClass('selected', k === child);
    }
    
}

const navbar = new Navbar({
    query: 'navbar',
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

/*const _Navbar = {
    ...elem({
        query: 'navbar',
        children: {
            home: '.home',
            research: '.research',
            people: '.people',
            publications: '.publications',
            gallery: '.gallery',
            contact: '.contact',
            tau: '.tau',
        }
    }),
    _select: function (child: TNavbarDivChild) {
        for (let k of [this.research, this.people, this.publications, this.gallery, this.contact])
            k.toggleClass('selected', k === child);
    },
    gotoPage: async function (page) {
        _startSeparatorAnimation();
        this._select()
        await page().init();
        _killSeparatorAnimation();
    }
};
*/

interface ISeparators extends BetterHTMLElement {
    right: BetterHTMLElement,
    left: BetterHTMLElement,
}

const _separators = <ISeparators>elem({query: 'separators', children: {left: '.left', right: '.right'}});


function _linearGradient(opac_stop_1: [number, string], opac_stop_2: [number, string]) {
    return `linear-gradient(90deg, rgba(0, 0, 0, ${opac_stop_1[0]}) ${opac_stop_1[1]}, rgba(0, 0, 0, ${opac_stop_2[0]}) ${opac_stop_2[1]})`
}

function _startSeparatorAnimation() {
    
    console.log('startSeparatorAnimation()');
    TL.fromTo(_separators.left.e, 1, {backgroundImage: _linearGradient([0, '0%'], [0.15, '150%'])}, {
        backgroundImage: _linearGradient([0, '0%'], [0.75, '10%']),
    });
    TL.fromTo(_separators.right.e, 1, {backgroundImage: _linearGradient([0.15, '-50%'], [0, '100%'])}, {
        backgroundImage: _linearGradient([0.75, '90%'], [0, '100%']),
    });
    
}

function _killSeparatorAnimation() {
    console.log('killSeparatorAnimation()');
    TL.killTweensOf([_separators.left.e, _separators.right.e]);
    _separators.left.css({backgroundImage: _linearGradient([0, '0%'], [0.1, '10%'])});
    _separators.right.css({backgroundImage: _linearGradient([0.1, '90%'], [0, '100%'])});
}

/*async function _gotoPage(page) {
    _startSeparatorAnimation();
    await page().init();
    _killSeparatorAnimation();
}
*/


/*navbar.home.pointerdown(() => {
    _startSeparatorAnimation();
    window.location.reload();
});
*/
/*navbar.research.pointerdown(() => {
    _gotoPage(ResearchPage);
});
navbar.people.pointerdown(async () => {
    _gotoPage(PeoplePage);
});
navbar.publications.pointerdown(async () => {
    _gotoPage(PublicationsPage);
});
navbar.gallery.pointerdown(async () => {
    _gotoPage(GalleryPage);
});
*/
