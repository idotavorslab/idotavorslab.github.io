const isIphone = window.navigator.userAgent.includes('iPhone');

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


class EventEmitter {
    
    private _store: TMap<Function[]> = {};
    
    constructor() {
    
    }
    
    emit(key: string, data?: any): void {
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
    
    on(key: string, fn: Function): void {
        if (this._store[key])
            this._store[key].push(fn);
        else
            this._store[key] = [fn];
    }
    
    one(key: string, fn: Function): void {
        function _fn() {
            log('_fn, calling fn() then removing.', JSON.parstr({'this._store[key].length': this._store[key].length}), 'b');
            fn();
            let indexofFn = (<Function[]>this._store[key]).findIndex(f => f.id === id);
            // TODO: remove for prod
            if (indexofFn === -1) throw new Error(`indexofFn is -1, key: "${key}"`);
            this._store[key].splice(indexofFn, 1);
            log('_fn, after removing.', JSON.parstr({'this._store[key].length': this._store[key].length}), 'b');
            
        }
        
        const id = Math.random();
        log(`EventEmitter.one,`, JSON.parstr({key, id}), 'b');
        const bound = _fn.bind(this);
        bound.id = id;
        this.on(key, bound);
    }
    
    until(key: 'navbarReady' | 'MOBILEReady', options: { once: boolean, debug?: string } = {once: true}): Promise<unknown> {
        let message = `EventEmitter.until`;
        if (options && options.debug)
            message += ` | (debug: ${options.debug})`;
        log(message, JSON.parstr({key}), 'bg');
        if (options && options.once)
            return new Promise(resolve =>
                this.one(key, () => {
                    message = `until one resolving key`;
                    if (options && options.debug)
                        message += ` | (debug: ${options.debug})`;
                    log(message, JSON.parstr({key}), 'bg');
                    return resolve();
                }));
        else
            return new Promise(resolve => this.on(key, () => {
                message = `until on resolving key`;
                if (options && options.debug)
                    message += ` | (debug: ${options.debug})`;
                log(message, JSON.parstr({key}), 'bg');
                return resolve();
            }))
    }
}


const Emitter = new EventEmitter();
// @ts-ignore
const WindowElem = elem({htmlElement: window})
    .on({
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
            
            
            console.log({innerWidth: window.innerWidth, MOBILE});
            if (window.location.hash !== "")
                fetchDict<{ logo: string }>('main/home/home.json').then(({logo}) => Navbar.home.attr({src: `main/home/${logo}`}));
            
            function cache(file: string, page: Routing.Page) {
                let src;
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
            
            /*console.log(...less('waiting 1000...'));
            wait(1000).then(() => {
                
                console.log(...less('done waiting, starting caching'));
                if (!window.location.hash.includes('research'))
                    cacheResearch();
                if (!window.location.hash.includes('people'))
                    cachePeople();
                if (!window.location.hash.includes('gallery'))
                    cacheGallery();
                console.log('done caching');
                console.groupEnd();
            });
            */
            
            
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

let Navbar; // WindowElem.load =>
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
    console.log({MOBILE});
    await Emitter.until("MOBILEReady", {debug: 'main.ts Footer'});
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
    /*    WindowElem.on({
            load: async () => {
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
        });*/
    
    
});

interface IHamburger extends Div {
    menu: Div;
    logo: Div;
    items: Div;
}

const hamburger = <IHamburger>elem({
    id: 'hamburger', children: {menu: '.menu', logo: '.logo', items: '.items'}
    
});
hamburger.logo.click((event: PointerEvent) => {
    event.stopPropagation();
    Routing.navigateTo("home");
    // anchor({href: ``}).appendTo(Body).click().remove();
});
hamburger.items.children('div').forEach((bhe: BetterHTMLElement) => {
    bhe.click((event: PointerEvent) => {
        event.stopPropagation();
        const innerText = bhe.e.innerText.toLowerCase();
        console.log(`hamburger ${innerText} click`);
        hamburger.removeClass('open');
        Routing.navigateTo(<Routing.PageSansHome>innerText);
        // let href = innerText === "home" ? '' : `#${innerText}`;
        // anchor({href}).appendTo(Body).click().remove(); // no need to select because Routing.route does this
    });
});

hamburger.click((event: PointerEvent) => {
    console.log('hamburger.click');
    hamburger.toggleClass('open');
    if (hamburger.hasClass('open')) {
        console.log('opened');
    } else {
        console.log('closed');
    }
});

