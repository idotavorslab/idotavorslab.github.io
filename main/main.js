const userAgent = window.navigator.userAgent;
const IS_GILAD = document.cookie.includes("gilad");
const SHOW_STATS = IS_GILAD && false;
const IS_IPHONE = userAgent.includes('iPhone');
const IS_SAFARI = !userAgent.includes('Firefox') && !userAgent.includes('Chrome') && userAgent.includes('Safari');
const DocumentElem = elem({ htmlElement: document });
const Body = elem({
    htmlElement: document.body,
    children: {
        ugug: '#ugug',
        windowStats: '#window_stats',
        footer: {
            '#footer': {
                address: 'div.address',
                contact: 'div.contact',
                map: '#contact_map',
                logos: 'div#logos',
            }
        },
        fundingSection: {
            '#funding_section': {
                sponsorsContainer: 'div#sponsors_container'
            }
        }
    }
});
const Home = elem({ id: 'home' });
const CacheDiv = elem({ id: 'cache' });
const WindowElem = elem({ htmlElement: window });
WindowElem.isLoaded = false;
WindowElem.promiseLoaded = async function () {
    console.log(...less('WindowElem.promiseLoaded(), this.isLoaded:'), this.isLoaded);
    if (this.isLoaded) {
        return true;
    }
    let count = 0;
    let ms = Math.random() * 10;
    while (ms < 5) {
        ms = Math.random() * 10;
    }
    while (!this.isLoaded) {
        if (count >= 2000) {
            if (count === 2000) {
                console.trace(`WindowElem.promiseLoaded() count: ${count}. Waiting 200ms, warning every 1s.`);
            }
            else {
                if (count % 5 === 0) {
                    console.warn(`WindowElem.promiseLoaded() count: ${count}. Waiting 200ms, warning every 1s.`);
                }
            }
            await wait(200);
        }
        else {
            await wait(ms);
        }
        count++;
    }
    console.log(...less('WindowElem.promiseLoaded() returning true'));
    this.isLoaded = true;
    return true;
};
const Hamburger = elem({
    id: 'hamburger', children: { menu: '.menu', logo: '.logo', items: '.items' }
});
Hamburger.toggle = function () {
    this.toggleClass('open');
    console.log(`Hamburger ${this.hasClass('open') ? "opened" : "closed"} (at Hamburger.toggle())`);
};
Hamburger.open = function () {
};
Hamburger.close = function () {
    this.removeClass('open');
};
Hamburger.logo.click((event) => {
    event.stopPropagation();
    Routing.navigateTo("home");
});
Hamburger.items.children('div').forEach((bhe) => {
    bhe.click((event) => {
        event.stopPropagation();
        const innerText = bhe.e.innerText.toLowerCase();
        console.log(`Hamburger ${innerText} click`);
        Hamburger.close();
        Routing.navigateTo(innerText);
    });
});
Hamburger.click((event) => {
    console.log('Hamburger.click');
    Hamburger.toggle();
});
WindowElem.on({
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
    resize: (event) => {
        if (SHOW_STATS) {
            Body.windowStats.html(windowStats());
        }
    },
    load: () => {
        function cache(file, page) {
            let src;
            if (file.includes('http') || file.includes('www')) {
                src = file;
            }
            else {
                src = `main/${page}/${file}`;
            }
            let image = new Image();
            let imgElem = elem({ htmlElement: image })
                .attr({ src, hidden: "" })
                .on({
                load: () => {
                    console.log(...less(`loaded ${page} | ${file}`));
                    CacheDiv.cacheAppend([[`${page}.${file}`, imgElem]]);
                }
            });
        }
        async function cachePeople() {
            console.log(...less('cachePeople'));
            const peopleData = await fetchDict('main/people/people.json');
            const { team: teamData, alumni: alumniData } = peopleData;
            for (let [_, { image }] of dict(teamData).items()) {
                cache(image, "people");
            }
            for (let [_, { image }] of dict(alumniData).items()) {
                cache(image, "people");
            }
        }
        async function cacheGallery() {
            console.log(...less('cacheGallery'));
            let galleryData = await fetchArray("main/gallery/gallery.json");
            const galleryFiles = galleryData.map(d => d.file);
            for (let file of galleryFiles) {
                cache(file, "gallery");
            }
        }
        async function cacheResearch() {
            console.log(...less('cacheResearch'));
            const researchData = await fetchDict('main/research/research.json');
            for (let [_, { image }] of researchData.items()) {
                cache(image, "research");
            }
        }
        console.log(`%cwindow loaded, window.location.hash: "${window.location.hash}"`, 'font-weight: bold');
        WindowElem.isLoaded = true;
        MOBILE = window.innerWidth <= $BP2;
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
        if (window.location.hash !== "") {
            fetchDict('main/home/home.json').then(({ logo }) => Navbar.home.attr({ src: `main/home/${logo}` }));
        }
        console.log('%cstats:', 'color: #B58059', {
            MOBILE, IS_IPHONE, IS_GILAD, IS_SAFARI, innerWidth
        });
        if (SHOW_STATS) {
            Body.windowStats.class('on').html(windowStats());
        }
        Body.footer.css({ height: IS_SAFARI ? '260px' : 'auto' });
        console.log(...less('waiting 1000...'));
        wait(1000).then(() => {
            console.log(...less('done waiting, starting caching'));
            if (!window.location.hash.includes('research')) {
                cacheResearch();
            }
            if (!window.location.hash.includes('people')) {
                cachePeople();
            }
            if (!window.location.hash.includes('gallery')) {
                cacheGallery();
            }
            console.log(...less('done caching'));
        });
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
fetchDict("main/contact/contact.json").then(async (data) => {
    Body.footer.address.append(anchor({ href: data.visit.link }).html(data.visit.address).target("_blank"));
    Body.footer.contact.append(paragraph().html(`Phone:
                                            <a href="tel:${data.call.phone}">${data.call.phone}</a><br>
                                            Email:
                                            <a href="mailto:${data.email.address}">${data.email.address}</a>`));
    const [uni, medicine, sagol] = Body.footer.logos.children('img');
    uni.click(() => window.open("https://www.tau.ac.il"));
    medicine.click(() => window.open("https://en-med.tau.ac.il/"));
    sagol.click(() => window.open("https://www.sagol.tau.ac.il/"));
    await WindowElem.promiseLoaded();
    if (!MOBILE) {
        await wait(2000);
        console.log(...less("Body.footer.contactSection.append(elem({tag: 'iframe'}))"));
        Body.footer.map.attr({
            frameborder: "0",
            allowfullscreen: "",
            src: data.map
        });
    }
});
//# sourceMappingURL=main.js.map