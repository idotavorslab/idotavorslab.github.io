const isIphone = window.clientInformation.userAgent.includes('iPhone');
const DocumentElem = elem({ htmlElement: document });
const Body = elem({ htmlElement: document.body });
const Home = elem({ id: 'home' });
const CacheDiv = elem({ id: 'cache' });
const WindowElem = elem({ htmlElement: window })
    .on({
    scroll: (event) => {
        if (window.scrollY > 0) {
            Navbar.removeClass('box-shadow');
        }
        else {
            Navbar.addClass('box-shadow');
        }
    },
    hashchange: (event) => {
        const newURL = event.newURL.replace(window.location.origin + window.location.pathname, "").replace('#', '');
        console.log('hash change, event.newURL:', event.newURL, '\nnewURL:', newURL);
        if (!bool(newURL)) {
            elem({ tag: 'a' }).attr({ href: `` }).click();
        }
        else {
            Routing.route(newURL);
        }
    },
    load: async () => {
        Navbar = new NavbarElem({
            query: 'div#navbar',
            children: {
                home: '.home',
                research: '.research',
                people: '.people',
                publications: '.publications',
                gallery: '.gallery',
                neuroanatomy: '.neuroanatomy',
                contact: '.contact',
            }
        });
        console.log('window loaded');
        function cache(file, page) {
            let src;
            if (file.includes('http') || file.includes('www')) {
                src = file;
            }
            else {
                src = `main/${page}/${file}`;
            }
            let imgElem = elem({ htmlElement: new Image() })
                .attr({ src, hidden: "" })
                .on({
                load: () => {
                    console.log(`${page} | loaded: ${file}`);
                    CacheDiv.cacheAppend([[`${page}.${file}`, imgElem]]);
                }
            });
        }
        async function cachePeople() {
            const peopleData = await fetchJson('main/people/people.json', "no-cache");
            const { team: teamData, alumni: alumniData } = peopleData;
            for (let [name, { image }] of dict(teamData).items())
                cache(image, "people");
            for (let [name, { image }] of dict(alumniData).items())
                cache(image, "people");
        }
        async function cacheGallery() {
            const galleryFiles = (await fetchJson("main/gallery/gallery.json", "no-cache")).map(d => d.file);
            for (let file of galleryFiles)
                cache(file, "gallery");
        }
        if (!window.location.hash.includes('gallery'))
            cacheGallery();
        if (!window.location.hash.includes('people'))
            cachePeople();
    }
});
const Footer = elem({ id: 'footer' });
class NavbarElem extends BetterHTMLElement {
    constructor({ query, children }) {
        super({ query, children });
        for (let k of Routing.pageStrings()) {
            this[k]
                .pointerdown(() => {
                let href = k === "home" ? '' : `#${k}`;
                console.log(`navbar ${k} pointerdown, clicking fake <a href="${href}">`);
                elem({ tag: 'a' }).attr({ href }).click();
            })
                .mouseover(() => this.emphasize(this[k]))
                .mouseout(() => this.resetPales());
        }
    }
    select(child) {
        for (let pageString of Routing.pageStrings()) {
            let pageElem = this[pageString];
            pageElem.toggleClass('selected', pageElem === child);
        }
    }
    emphasize(child) {
        for (let pageString of Routing.pageStrings()) {
            let pageElem = this[pageString];
            pageElem.toggleClass('pale', pageElem !== child);
        }
    }
    resetPales() {
        for (let pageString of Routing.pageStrings()) {
            let pageElem = this[pageString];
            pageElem.removeClass('pale');
        }
    }
}
let Navbar;
//# sourceMappingURL=main.js.map