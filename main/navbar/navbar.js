class Navbar extends BetterHTMLElement {
    constructor({ query, children }) {
        super({ query, children });
        for (let k of ["home", "research", "people", "publications", "gallery", "contact"]) {
            this[k].pointerdown(() => {
                let href = k === "home" ? '' : `#${k}`;
                console.log(`navbar ${k} pointerdown, clicking fake <a href="${href}">`);
                elem({ tag: 'a' }).attr({ href }).click();
            });
        }
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
function getPageObj(key) {
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
function route(url) {
    console.log(`route("${url}")`);
    if (bool(url)) {
        if (["research", "people", "publications", "gallery", "contact"].includes(url)) {
            console.log('\tvalid url, calling pageObj().init()');
            const pageObj = getPageObj(url);
            pageObj().init();
        }
        else {
            elem({ tag: 'a' }).attr({ href: `` }).click();
        }
    }
    else {
        console.log('\tempty url, calling HomePage().init()');
        HomePage().init();
    }
}
WindowElem.on({
    scroll: (event) => {
        if (window.scrollY > 0) {
            navbar.removeClass('box-shadow');
        }
        else {
            navbar.addClass('box-shadow');
        }
    },
    hashchange: (event) => {
        const newURL = event.newURL.replace(window.location.origin, "").slice(1).replace('#', '');
        console.log('hash change', event, '\nnewURL:', newURL);
        if (!bool(newURL)) {
            elem({ tag: 'a' }).attr({ href: `` }).click();
        }
        else {
            route(newURL);
        }
    }
});
let lastPage = window.location.hash.slice(1);
console.log(`document root, calling route("${lastPage}")`);
route(lastPage);
//# sourceMappingURL=navbar.js.map