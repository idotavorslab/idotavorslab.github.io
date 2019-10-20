const userAgent = window.navigator.userAgent;
const IS_GILAD = userAgent === "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36";
const IS_IPHONE = userAgent.includes('iPhone');
const IS_SAFARI = !userAgent.includes('Firefox') && !userAgent.includes('Chrome') && userAgent.includes('Safari');
const DocumentElem = elem({ htmlElement: document });
const Body = elem({ htmlElement: document.body });
const Home = elem({ id: 'home' });
const FundingSection = elem({
    id: 'funding_section', children: {
        sponsorsContainer: 'div#sponsors_container'
    }
});
const CacheDiv = elem({ id: 'cache' });
const WindowElem = elem({ htmlElement: window });
WindowElem.isLoaded = false;
WindowElem.promiseLoaded = async function () {
    console.log('WindowElem.promiseLoaded(), this.isLoaded:', this.isLoaded);
    if (this.isLoaded)
        return true;
    let count = 0;
    let ms = Math.random() * 10;
    while (ms < 5)
        ms = Math.random() * 10;
    while (!this.isLoaded) {
        if (count >= 2000) {
            if (count === 2000)
                console.trace(`WindowElem.promiseLoaded() count: ${count}. Waiting 200ms, warning every 1s.`);
            else if (count % 5 === 0)
                console.warn(`WindowElem.promiseLoaded() count: ${count}. Waiting 200ms, warning every 1s.`);
            await wait(200);
        }
        else {
            await wait(ms);
        }
        count++;
    }
    console.log(...green('WindowElem.promiseLoaded() returning true'));
    this.isLoaded = true;
    return true;
};
const Hamburger = elem({
    id: 'hamburger', children: { menu: '.menu', logo: '.logo', items: '.items' }
});
Hamburger.logo.click((event) => {
    event.stopPropagation();
    Routing.navigateTo("home");
});
Hamburger.items.children('div').forEach((bhe) => {
    bhe.click((event) => {
        event.stopPropagation();
        const innerText = bhe.e.innerText.toLowerCase();
        console.log(`Hamburger ${innerText} click`);
        Hamburger.removeClass('open');
        Routing.navigateTo(innerText);
    });
});
Hamburger.click((event) => {
    console.log('Hamburger.click');
    Hamburger.toggleClass('open');
    if (Hamburger.hasClass('open')) {
        console.log('Hamburger opened');
    }
    else {
        console.log('Hamburger closed');
    }
});
const Ugug = elem({ id: 'ugug' });
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
    load: () => {
        console.log(`%cwindow loaded, window.location.hash: "${window.location.hash}"`, 'font-weight: bold');
        WindowElem.isLoaded = true;
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
        console.log(...less('waiting 1000...'));
        wait(1000).then(() => {
            console.log(...less('done waiting, starting caching'));
            if (!window.location.hash.includes('research'))
                cacheResearch();
            if (!window.location.hash.includes('people'))
                cachePeople();
            if (!window.location.hash.includes('gallery'))
                cacheGallery();
            console.log(...less('done caching'));
            console.groupEnd();
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
const Footer = elem({
    id: 'footer', children: {
        address: 'div.address',
        contact: 'div.contact',
        map: '#contact_map',
        logos: 'div#logos',
    }
}).css({ height: IS_SAFARI ? '260px' : 'auto' });
fetchDict("main/contact/contact.json").then(async (data) => {
    Footer.address.append(anchor({ href: data.visit.link }).html(data.visit.address).target("_blank"));
    Footer.contact.append(paragraph().html(`Phone:
                                            <a href="tel:${data.call.phone}">${data.call.phone}</a><br>
                                            Email:
                                            <a href="mailto:${data.email.address}">${data.email.address}</a>`));
    const [uni, medicine, sagol] = Footer.logos.children('img');
    uni.click(() => window.open("https://www.tau.ac.il"));
    medicine.click(() => window.open("https://en-med.tau.ac.il/"));
    sagol.click(() => window.open("https://www.sagol.tau.ac.il/"));
    await WindowElem.promiseLoaded();
    console.log('main.ts popuplating Footer;', { MOBILE, IS_IPHONE, IS_GILAD, IS_SAFARI });
    if (!MOBILE) {
        await wait(3000);
        console.log("Footer.contactSection.append(elem({tag: 'iframe'}))");
        Footer.map.attr({
            frameborder: "0",
            allowfullscreen: "",
            src: data.map
        });
    }
});
//# sourceMappingURL=main.js.map