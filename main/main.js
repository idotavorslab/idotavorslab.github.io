const isIphone = window.navigator.userAgent.includes('iPhone');
const DocumentElem = elem({ htmlElement: document });
const Body = elem({ htmlElement: document.body });
const Home = elem({ id: 'home' });
const FundingSection = elem({
    id: 'funding_section', children: {
        sponsorsContainer: 'div#sponsors_container'
    }
});
const CacheDiv = elem({ id: 'cache' });
class EventEmitter {
    constructor() {
        this._store = {};
    }
    emit(key, data) {
        if (this._store[key]) {
            for (let fn of this._store[key]) {
                fn(data || undefined);
            }
        }
    }
    on(key, fn) {
        if (this._store[key])
            this._store[key].push(fn);
        else
            this._store[key] = [fn];
    }
    one(key, fn) {
        function _fn() {
            console.log('_fn, calling fn() then removing. this._store[key].length:', this._store[key].length);
            fn();
            let indexofFn = this._store[key].indexOf(_fn);
            this._store[key].splice(indexofFn, 1);
            console.log('_fn, after removing. this._store[key].length:', this._store[key].length);
        }
        this.on(key, _fn.bind(this));
    }
    until(key, options = { once: true }) {
        console.log('EventEmitter until,', { key, options });
        if (options && options.once)
            return new Promise(resolve => this.one(key, resolve));
        else
            return new Promise(resolve => this.on(key, resolve));
    }
}
const Emitter = new EventEmitter();
const WindowElem = elem({ htmlElement: window })
    .on({
    scroll: (event) => {
        if (Navbar !== undefined) {
            if (window.scrollY > 0) {
                Navbar.removeClass('box-shadow');
            }
            else {
                Navbar.addClass('box-shadow');
            }
        }
    },
    hashchange: (event) => {
        const newURL = event.newURL.replace(window.location.origin + window.location.pathname, "").replace('#', '');
        if (!bool(newURL)) {
            anchor({ href: '' }).click();
        }
        else {
            console.log(`%chash change, event.newURL: "${event.newURL}"\n\tnewURL: "${newURL}"`, `color: ${GOOGLEBLUE}`);
            Routing.route(newURL);
        }
    },
    load: () => {
        MOBILE = window.innerWidth <= $BP4;
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
        console.log('WindowElem onload emitting navbarReady');
        Emitter.emit('navbarReady');
        console.group(`window loaded, window.location.hash: "${window.location.hash}"`);
        console.log({ innerWidth: window.innerWidth, MOBILE });
        if (window.location.hash !== "")
            fetchDict('main/home/home.json').then(({ logo }) => Navbar.home.attr({ src: `main/home/${logo}` }));
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
                    CacheDiv.cacheAppend([[`${page}.${file}`, imgElem]]);
                }
            });
        }
        async function cachePeople() {
            console.log(...less('cachePeople'));
            const peopleData = await fetchDict('main/people/people.json');
            const { team: teamData, alumni: alumniData } = peopleData;
            for (let [_, { image }] of dict(teamData).items())
                cache(image, "people");
            for (let [_, { image }] of dict(alumniData).items())
                cache(image, "people");
        }
        async function cacheGallery() {
            console.log(...less('cacheGallery'));
            let galleryData = await fetchArray("main/gallery/gallery.json");
            const galleryFiles = galleryData.map(d => d.file);
            for (let file of galleryFiles)
                cache(file, "gallery");
        }
        async function cacheResearch() {
            console.log(...less('cacheResearch'));
            const researchData = await fetchDict('main/research/research.json');
            for (let [_, { image }] of researchData.items())
                cache(image, "research");
        }
    }
});
class NavbarElem extends BetterHTMLElement {
    constructor({ query, children }) {
        super({ query, children });
        for (let pageString of Routing.pageStrings()) {
            this[pageString]
                .click(() => {
                let href = pageString === "home" ? '' : `#${pageString}`;
                console.log(`navbar ${pageString} click, clicking fake <a href="${href}">`);
                anchor({ href }).click();
            })
                .mouseover(() => this._emphasize(this[pageString]))
                .mouseout(() => this._resetPales());
        }
    }
    select(child) {
        for (let pageString of Routing.pageStrings()) {
            let pageElem = this[pageString];
            pageElem.toggleClass('selected', pageElem === child);
        }
    }
    _emphasize(child) {
        for (let pageString of Routing.pageStrings()) {
            let pageElem = this[pageString];
            pageElem.toggleClass('pale', pageElem !== child);
        }
    }
    _resetPales() {
        for (let pageString of Routing.pageStrings()) {
            let pageElem = this[pageString];
            pageElem.removeClass('pale');
        }
    }
}
let Navbar;
const Footer = elem({
    id: 'footer', children: {
        contactSection: {
            '#contact_section': {
                mainCls: {
                    '.main-cls': {
                        address: '.address',
                        contact: '.contact',
                        map: '#contact_map'
                    }
                }
            }
        },
        logosSection: {
            '#logos_section': {
                mainCls: '.main-cls'
            }
        },
        ugugSection: {
            '#ugug_section': {
                mainCls: '.main-cls'
            }
        }
    }
});
Footer.ugugSection.mainCls.html(`2019
    Developed by <a href="http://giladbarnea.github.io" target="_blank">Gilad Barnea</a>`);
fetchDict("main/contact/contact.json").then(data => {
    Footer.contactSection.mainCls.address.append(anchor({ href: data.visit.link }).html(data.visit.address).target("_blank"));
    Footer.contactSection.mainCls.contact.append(paragraph().html(`Phone:
                                                        <a href="tel:${data.call.phone}">${data.call.phone}</a><br>
                                                        Email:
                                                        <a href="mailto:${data.email.address}">${data.email.address}</a>`));
    Footer.contactSection.mainCls.append(elem({ tag: 'iframe' })
        .id('contact_map')
        .attr({
        frameborder: "0",
        allowfullscreen: "",
        src: data.map
    }));
    const [uni, medicine, sagol] = Footer.logosSection.mainCls.children('img');
    uni.click(() => window.open("https://www.tau.ac.il"));
    medicine.click(() => window.open("https://en-med.tau.ac.il/"));
    sagol.click(() => window.open("https://www.sagol.tau.ac.il/"));
});
const hamburgerMenu = elem({
    id: 'hamburger_menu', children: { hamburger: '#hamburger' }
});
const navigationItems = elem({ id: 'navigation_items' });
navigationItems.children('div').forEach((bhe) => {
    bhe.click(() => {
        const innerText = bhe.e.innerText.toLowerCase();
        let href = innerText === "home" ? '' : `#${innerText}`;
        hamburgerMenu.removeClass('open');
        navigationItems.removeClass('open');
        anchor({ href }).click();
    });
});
hamburgerMenu.click(async (event) => {
    console.log('hamburgerMenu.click');
    hamburgerMenu.toggleClass('open');
    navigationItems.toggleClass('open');
    if (hamburgerMenu.hasClass('open')) {
        console.log('opened');
    }
    else {
        console.log('closed');
    }
});
//# sourceMappingURL=main.js.map