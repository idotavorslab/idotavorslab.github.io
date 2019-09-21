const isIphone = window.clientInformation.userAgent.includes('iPhone');

// @ts-ignore
const DocumentElem = elem({htmlElement: document});
const Body = elem({htmlElement: document.body});
const Home = elem({id: 'home'});


const CacheDiv = elem({id: 'cache'});
// @ts-ignore
const WindowElem = elem({htmlElement: window})
    .on({
        scroll: (event: Event) => {
            if (window.scrollY > 0) {
                Navbar.removeClass('box-shadow')
            } else {
                Navbar.addClass('box-shadow')
                
            }
            
        },
        hashchange: (event: HashChangeEvent) => {
            // called on navbar click, backbutton click
            // routeNew(event.newURL);
            const newURL = event.newURL.replace(window.location.origin + window.location.pathname, "").replace('#', '');
            console.log('hash change, event.newURL:', event.newURL, '\nnewURL:', newURL);
            if (!bool(newURL)) {
                // this prevents the user pressing back to homepage, then route calling HomePage().init() instead of reloading
                elem({tag: 'a'}).attr({href: ``}).click()
            } else {
                Routing.route(<Routing.Page>newURL);
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
            
            async function cachePeople() {
                const peopleData = await fetchJson('main/people/people.json', "no-cache");
                const {team: teamData, alumni: alumniData} = peopleData;
                for (let [name, {image}] of dict(teamData).items()) {
                    let src;
                    if (image.includes('http') || image.includes('www')) {
                        src = image;
                    } else {
                        src = `main/people/${image}`;
                    }
                    let imageElem = elem({htmlElement: new Image()})
                        .attr({
                            src,
                            hidden: ""
                        })
                        .on({
                            load: () => {
                                console.log(`cachePeople() | loaded: ${image}`);
                                CacheDiv.cacheAppend([[`people.${image}`, imageElem]]);
                            }
                        });
                }
            }
            
            async function cacheGallery() {
                const galleryFiles = (await fetchJson("main/gallery/gallery.json", "no-cache")).map(d => d.file);
                for (let file of galleryFiles) {
                    let src;
                    if (file.includes('http') || file.includes('www')) {
                        src = file;
                    } else {
                        src = `main/gallery/${file}`;
                    }
                    let imageElem = elem({htmlElement: new Image()})
                        .attr({
                            src,
                            hidden: ""
                        })
                        .on({
                            load: () => {
                                console.log(`cacheGallery() | loaded: ${file}`);
                                CacheDiv.cacheAppend([[`gallery.${file}`, imageElem]]);
                            }
                        });
                }
                
            }
            
            if (!window.location.hash.includes('gallery'))
                await cacheGallery();
            if (!window.location.hash.includes('people'))
                await cachePeople();
        }
    });
const Footer = elem({id: 'footer'});


class NavbarElem extends BetterHTMLElement {
    home: Img;
    research: Div;
    people: Div;
    publications: Div;
    gallery: Div;
    neuroanatomy: Div;
    contact: Div;
    
    constructor({query, children}) {
        super({query, children});
        // this.home.pointerdown(() => {
        //     // _startSeparatorAnimation();
        //     // @ts-ignore
        //     window.location = window.location.origin;
        // });
        
        for (let k of Routing.pageStrings()) {
            this[k]
                .pointerdown(() => {
                    let href = k === "home" ? '' : `#${k}`;
                    console.log(`navbar ${k} pointerdown, clicking fake <a href="${href}">`);
                    elem({tag: 'a'}).attr({href}).click(); // no need to select because Routing.route does this
                })
                .mouseover(() => this.emphasize(<Div>this[k]))
                .mouseout(() => this.resetPales());
        }
        
    }
    
    
    /*async gotoPageOLD(pageName: Page) {
        console.log(`navbar.ts.Navbar.gotoPage(${pageName})`);
        DocumentElem.allOff();
        // const bottomSeparators = document.querySelectorAll(".separators")[1];
        // if (bottomSeparators)
        //     bottomSeparators.remove();
        
        const logos = elem({id: 'logos'});
        if (logos.e)
            logos.remove();
        // _startSeparatorAnimation();
        const pageObj = Navbar.getPageObj(pageName);
        this._select(this[pageName]);
        history.pushState(null, null, `#${pageName}`);
        // history.replaceState()
        await pageObj().init();
        // _killSeparatorAnimation();
    }
    */
    
    select(child: Div): void {
        for (let pageString of Routing.pageStrings()) {
            let pageElem = this[pageString];
            pageElem.toggleClass('selected', pageElem === child);
        }
    }
    
    emphasize(child: Div): void {
        for (let pageString of Routing.pageStrings()) {
            let pageElem = this[pageString];
            pageElem.toggleClass('pale', pageElem !== child);
        }
    }
    
    resetPales(): void {
        for (let pageString of Routing.pageStrings()) {
            let pageElem = this[pageString];
            pageElem.removeClass('pale');
        }
    }
    
    
}


let Navbar; // WindowElem.load =>
