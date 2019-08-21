class Navbar extends BetterHTMLElement {
    constructor({ query, children }) {
        super({ query, children });
        this.home.pointerdown(() => {
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
        const pageObj = this._pageNameObjMap[pageName];
        this._select(this[pageName]);
        await pageObj().init();
    }
    _select(child) {
        for (let k of [this.research, this.people, this.publications, this.gallery, this.contact]) {
            k.toggleClass('selected', k === child);
        }
    }
}
const navbar = new Navbar({
    query: '#navbar',
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
//# sourceMappingURL=navbar.js.map