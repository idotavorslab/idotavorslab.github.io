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
        log(`EventEmitter.emit()`, JSON.parstr({
            key,
            'this._store[key](length?)': this._store[key] ? this._store[key].length : undefined
        }), 'l');
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
            log('_fn, calling fn() then removing.', JSON.parstr({ 'this._store[key].length': this._store[key].length }), 'b');
            fn();
            let indexofFn = this._store[key].findIndex(f => f.id === id);
            if (indexofFn === -1)
                throw new Error(`indexofFn is -1, key: "${key}"`);
            this._store[key].splice(indexofFn, 1);
            log('_fn, after removing.', JSON.parstr({ 'this._store[key].length': this._store[key].length }), 'b');
        }
        const id = Math.random();
        log(`EventEmitter.one,`, JSON.parstr({ key, id }), 'b');
        const bound = _fn.bind(this);
        bound.id = id;
        this.on(key, bound);
    }
    until(key, options = { once: true }) {
        let message = `EventEmitter.until`;
        if (options && options.debug)
            message += ` | (debug: ${options.debug})`;
        log(message, JSON.parstr({ key }), 'bg');
        if (options && options.once)
            return new Promise(resolve => this.one(key, () => {
                message = `until one resolving key`;
                if (options && options.debug)
                    message += ` | (debug: ${options.debug})`;
                log(message, JSON.parstr({ key }), 'bg');
                return resolve();
            }));
        else
            return new Promise(resolve => this.on(key, () => {
                message = `until on resolving key`;
                if (options && options.debug)
                    message += ` | (debug: ${options.debug})`;
                log(message, JSON.parstr({ key }), 'bg');
                return resolve();
            }));
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
            Routing.navigateTo("home");
        }
        else {
            console.log(`%chash change, event.newURL: "${event.newURL}"\n\tnewURL: "${newURL}"`, `color: ${GOOGLEBLUE}`);
            Routing.initPage(newURL);
        }
    },
    load: () => {
        console.log(`window loaded, window.location.hash: "${window.location.hash}"`);
        MOBILE = window.innerWidth <= $BP4;
        Emitter.emit('MOBILEReady');
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
        Emitter.emit('navbarReady');
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
                console.log(`navbar ${pageString} click`);
                Routing.navigateTo(pageString);
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
fetchDict("main/contact/contact.json").then(async (data) => {
    Footer.contactSection.mainCls.address.append(anchor({ href: data.visit.link }).html(data.visit.address).target("_blank"));
    Footer.contactSection.mainCls.contact.append(paragraph().html(`Phone:
                                                        <a href="tel:${data.call.phone}">${data.call.phone}</a><br>
                                                        Email:
                                                        <a href="mailto:${data.email.address}">${data.email.address}</a>`));
    const [uni, medicine, sagol] = Footer.logosSection.mainCls.children('img');
    uni.click(() => window.open("https://www.tau.ac.il"));
    medicine.click(() => window.open("https://en-med.tau.ac.il/"));
    sagol.click(() => window.open("https://www.sagol.tau.ac.il/"));
    console.log({ MOBILE });
    await Emitter.until("MOBILEReady", { debug: 'main.ts Footer' });
    if (!MOBILE) {
        await wait(3000);
        console.log("Footer.contactSection.mainCls.append(elem({tag: 'iframe'}))");
        Footer.contactSection.mainCls.append(elem({ tag: 'iframe' })
            .id('contact_map')
            .attr({
            frameborder: "0",
            allowfullscreen: "",
            src: data.map
        }));
    }
});
const hamburger = elem({
    id: 'hamburger', children: { menu: '.menu', logo: '.logo', items: '.items' }
});
hamburger.logo.click((event) => {
    event.stopPropagation();
    Routing.navigateTo("home");
});
hamburger.items.children('div').forEach((bhe) => {
    bhe.click((event) => {
        event.stopPropagation();
        const innerText = bhe.e.innerText.toLowerCase();
        console.log(`hamburger ${innerText} click`);
        hamburger.removeClass('open');
        Routing.navigateTo(innerText);
    });
});
hamburger.click((event) => {
    console.log('hamburger.click');
    hamburger.toggleClass('open');
    if (hamburger.hasClass('open')) {
        console.log('opened');
    }
    else {
        console.log('closed');
    }
});
//# sourceMappingURL=main.js.map