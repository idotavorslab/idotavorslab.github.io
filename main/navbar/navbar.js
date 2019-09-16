class Navbar extends BetterHTMLElement {
    constructor({ query, children }) {
        super({ query, children });
        this.home.pointerdown(() => {
            window.location = window.location.origin;
        });
        for (let k of ["research", "people", "publications", "gallery", "contact"]) {
            this[k].pointerdown(() => {
                console.log(`this[k].pointerdown, k: ${k}`);
                this._gotoPage(k);
            });
        }
    }
    static _getPageObj(key) {
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
    async _gotoPage(pageName) {
        console.log(`navbar.ts.Navbar._gotoPage(${pageName})`);
        DocumentElem.allOff();
        const bottomSeparators = document.querySelectorAll(".separators")[1];
        if (bottomSeparators)
            bottomSeparators.remove();
        const logos = elem({ id: 'logos' });
        if (logos)
            logos.remove();
        const pageObj = Navbar._getPageObj(pageName);
        this._select(this[pageName]);
        elem({ tag: 'a' }).attr({ href: `#${pageName}` }).click();
        await pageObj().init();
    }
    _select(child) {
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
_Window.on({
    scroll: (event) => {
        if (window.scrollY > 0) {
            navbar.removeClass('box-shadow');
        }
        else {
            navbar.addClass('box-shadow');
        }
    }
});
//# sourceMappingURL=navbar.js.map