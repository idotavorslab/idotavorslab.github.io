const IS_GILAD = window.navigator.userAgent === "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36";
const IS_IPHONE = window.navigator.userAgent.includes('iPhone');

// @ts-ignore
const DocumentElem = elem({htmlElement: document});
const Body = elem({htmlElement: document.body});
const Home = elem({id: 'home'});
const FundingSection = <Div & { sponsorsContainer: Div }>elem({
    id: 'funding_section', children: {
        sponsorsContainer: 'div#sponsors_container'
    }
});

const CacheDiv = elem({id: 'cache'});

// @ts-ignore
const WindowElem = elem({htmlElement: window});
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
        } else {
            await wait(ms);
        }
        
        count++;
    }
    console.log(...green('WindowElem.promiseLoaded() returning true'));
    this.isLoaded = true;
    return true;
};

interface IHamburger extends Div {
    menu: Div;
    logo: Div;
    items: Div;
}

const Hamburger = <IHamburger>elem({
    id: 'hamburger', children: {menu: '.menu', logo: '.logo', items: '.items'}
    
});
Hamburger.logo.click((event: PointerEvent) => {
    event.stopPropagation();
    Routing.navigateTo("home");
});
Hamburger.items.children('div').forEach((bhe: BetterHTMLElement) => {
    bhe.click((event: PointerEvent) => {
        event.stopPropagation();
        const innerText = bhe.e.innerText.toLowerCase();
        console.log(`Hamburger ${innerText} click`);
        Hamburger.removeClass('open');
        Routing.navigateTo(<Routing.PageSansHome>innerText);
    });
});

Hamburger.click((event: PointerEvent) => {
    console.log('Hamburger.click');
    Hamburger.toggleClass('open');
    if (Hamburger.hasClass('open')) {
        console.log('Hamburger opened');
    } else {
        console.log('Hamburger closed');
    }
});


WindowElem.on({
    scroll: (event: Event) => {
        /*await untilNotUndefined(Navbar, 'scroll Navbar');
        if (window.scrollY > 0) {
            Navbar.removeClass('box-shadow')
        } else {
            Navbar.addClass('box-shadow')
            
        }
        */
        // Emitter.on('navbarReady', () => window.scrollY > 0 ? Navbar.removeClass('box-shadow') : Navbar.addClass('box-shadow'));
        /*console.log('scroll started waiting for navbarReady');
        Emitter.on('navbarReady', () => {
            console.log('scroll stopped waiting for navbarReady');
            if (window.scrollY > 0) {
                Navbar.removeClass('box-shadow')
            } else {
                Navbar.addClass('box-shadow')
                
            }
        });
        */
        
        if (Navbar !== undefined) {
            if (window.scrollY > 0) {
                // console.log('scroll Navbar !== undefined, removing box-shadow');
                Navbar.removeClass('box-shadow')
            } else {
                // console.log('scroll Navbar !== undefined, adding box-shadow');
                Navbar.addClass('box-shadow')
                
            }
        } /*else {
                console.log('scroll Navbar === undefined, waiting for navbarReady...');
                Emitter.until('navbarReady').then(() => {
                    if (window.scrollY > 0) {
                        console.log('scroll stopped waiting for navbarReady, removing box-shadow');
                        Navbar.removeClass('box-shadow')
                    } else {
                        console.log('scroll stopped waiting for navbarReady, adding box-shadow');
                        Navbar.addClass('box-shadow')
                        
                    }
                })
            }
            */
        
        
    },
    hashchange: (event: HashChangeEvent) => {
        // called on navbar click, backbutton click
        const newURL = event.newURL.replace(window.location.origin + window.location.pathname, "").replace('#', '');
        if (!bool(newURL)) {
            // this prevents the user pressing back to homepage, then route calling HomePage().init() instead of reloading
            Routing.navigateTo("home");
            // anchor({href: ``}).appendTo(Body).click().remove();
        } else {
            // regular navbar click
            console.log(`%chash change, event.newURL: "${event.newURL}"\n\tnewURL: "${newURL}"`, `color: ${GOOGLEBLUE}`);
            Routing.initPage(<Routing.PageSansHome>newURL);
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
        
        
        console.log({innerWidth: window.innerWidth, MOBILE});
        if (window.location.hash !== "")
            fetchDict<{ logo: string }>('main/home/home.json').then(({logo}) => Navbar.home.attr({src: `main/home/${logo}`}));
        
        function cache(file: string, page: Routing.Page) {
            let src: string;
            if (file.includes('http') || file.includes('www')) {
                src = file;
            } else {
                src = `main/${page}/${file}`;
            }
            let imgElem = elem({htmlElement: new Image()})
                .attr({src, hidden: ""})
                .on({
                    load: () => {
                        // console.log(...less(`loaded ${page} | ${file}`));
                        CacheDiv.cacheAppend([[`${page}.${file}`, imgElem]]);
                    }
                });
        }
        
        async function cachePeople() {
            console.log(...less('cachePeople'));
            const peopleData = await fetchDict('main/people/people.json');
            const {team: teamData, alumni: alumniData} = peopleData;
            for (let [_, {image}] of dict(teamData).items())
                cache(image, "people");
            for (let [_, {image}] of dict(alumniData).items())
                cache(image, "people")
        }
        
        async function cacheGallery() {
            console.log(...less('cacheGallery'));
            let galleryData = await fetchArray<{ file: string }>("main/gallery/gallery.json");
            const galleryFiles = galleryData.map(d => d.file);
            for (let file of galleryFiles)
                cache(file, "gallery")
        }
        
        async function cacheResearch() {
            console.log(...less('cacheResearch'));
            const researchData = await fetchDict('main/research/research.json');
            for (let [_, {image}] of researchData.items())
                cache(image, "research")
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
    home: Div;
    research: Div;
    people: Div;
    publications: Div;
    gallery: Div;
    neuroanatomy: Div;
    contact: Div;
    
    constructor({query, children}) {
        super({query, children});
        for (let pageString of Routing.pageStrings()) {
            this[pageString]
                .click(() => {
                    console.log(`navbar ${pageString} click`);
                    Routing.navigateTo(pageString);
                    /*let href = pageString === "home" ? '' : `#${pageString}`;
                    // empty => page reloads to root => route("")
                    // #something => onhashchange
                    
                    anchor({href}).appendTo(Body).click().remove(); // no need to select because Routing.route does this
                    */
                })
                .mouseover(() => this._emphasize(<Div>this[pageString]))
                .mouseout(() => this._resetPales());
        }
        /*this.e.addEventListener('navbarReady', (event) => {
            console.log('navbarReady fired within ctor');
        })
        this.e.dispatchEvent(NavbarReady);
        */
    }
    
    
    select(child: Div): void {
        for (let pageString of Routing.pageStrings()) {
            let pageElem = this[pageString];
            pageElem.toggleClass('selected', pageElem === child);
        }
    }
    
    private _emphasize(child: Div): void {
        for (let pageString of Routing.pageStrings()) {
            let pageElem = this[pageString];
            pageElem.toggleClass('pale', pageElem !== child);
        }
    }
    
    private _resetPales(): void {
        for (let pageString of Routing.pageStrings()) {
            let pageElem = this[pageString];
            pageElem.removeClass('pale');
        }
    }
    
    
}

let Navbar: NavbarElem; // WindowElem.load =>
// let NavbarReady = new Event('navbarReady');

// ***  Footer
interface IFooter extends Div {
    contactSection: Div & {
        mainCls: Div & {
            address: Div;
            contact: Div;
            map: Div
        }
    };
    logosSection: Div & {
        mainCls: Div
    };
    ugugSection: Div & {
        mainCls: Div
    }
}

const Footer: IFooter = <IFooter>elem({
    id: 'footer', children: {
        contactSection: {
            '#contact_section': {
                mainCls: {
                    '.main-cls': {
                        address: '.address',
                        contact: '.contact',
                        // map: '#contact_map'
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

type TContactData = {
    visit: { address: string, link: string, icon: string },
    call: { hours: string, phone: string, icon: string },
    email: { address: string, icon: string, }
    map: string,
    form: string
};
fetchDict<TContactData>("main/contact/contact.json").then(async data => {
    Footer.contactSection.mainCls.address.append(anchor({href: data.visit.link}).html(data.visit.address).target("_blank"));
    Footer.contactSection.mainCls.contact.append(paragraph().html(`Phone:
                                                        <a href="tel:${data.call.phone}">${data.call.phone}</a><br>
                                                        Email:
                                                        <a href="mailto:${data.email.address}">${data.email.address}</a>`));
    
    const [uni, medicine, sagol] = Footer.logosSection.mainCls.children('img');
    uni.click(() => window.open("https://www.tau.ac.il"));
    medicine.click(() => window.open("https://en-med.tau.ac.il/"));
    sagol.click(() => window.open("https://www.sagol.tau.ac.il/"));
    await WindowElem.promiseLoaded();
    console.log({MOBILE, IS_IPHONE, IS_GILAD});
    if (!MOBILE) {
        await wait(3000);
        console.log("Footer.contactSection.mainCls.append(elem({tag: 'iframe'}))");
        Footer.contactSection.mainCls.append(
            elem({tag: 'iframe'})
                .id('contact_map')
                .attr({
                    frameborder: "0",
                    allowfullscreen: "",
                    src: data.map
                }),
        );
        
    }
    
    
});

