class Navbar extends BetterHTMLElement {
    constructor({ query, children }) {
        super({ query, children });
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
                console.log('this[k].pointerdown, k:', k);
                this._gotoPage(k);
            });
        }
    }
    async _gotoPage(pageName) {
        _startSeparatorAnimation();
        const pageObj = this._pageNameObjMap[pageName];
        this._select(this[pageName]);
        await pageObj().init();
        _killSeparatorAnimation();
    }
    _select(child) {
        for (let k of [this.research, this.people, this.publications, this.gallery, this.contact]) {
            k.toggleClass('selected', k === child);
        }
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
const _separators = elem({ query: 'separators', children: { left: '.left', right: '.right' } });
function _linearGradient(opac_stop_1, opac_stop_2) {
    return `linear-gradient(90deg, rgba(0, 0, 0, ${opac_stop_1[0]}) ${opac_stop_1[1]}, rgba(0, 0, 0, ${opac_stop_2[0]}) ${opac_stop_2[1]})`;
}
function _startSeparatorAnimation() {
    TL.fromTo(_separators.left.e, 0.5, { backgroundImage: _linearGradient([0, '0%'], [0.15, '150%']) }, {
        backgroundImage: _linearGradient([0, '0%'], [0.75, '10%']),
    });
    TL.fromTo(_separators.right.e, 0.5, { backgroundImage: _linearGradient([0.15, '-50%'], [0, '100%']) }, {
        backgroundImage: _linearGradient([0.75, '90%'], [0, '100%']),
    });
}
function _killSeparatorAnimation() {
    TL.killTweensOf([_separators.left.e, _separators.right.e]);
    _separators.left.css({ backgroundImage: _linearGradient([0, '0%'], [0.1, '10%']) });
    _separators.right.css({ backgroundImage: _linearGradient([0.1, '90%'], [0, '100%']) });
}
//# sourceMappingURL=navbar.js.map