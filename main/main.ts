const isIphone = window.clientInformation.userAgent.includes('iPhone');

// @ts-ignore
const DocumentElem = elem({htmlElement: document});
const Body = elem({htmlElement: document.body});
const Home = elem({id: 'home'});
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
            const newURL = event.newURL.replace(window.location.origin, "").slice(1).replace('#', '');
            console.log('hash change, event.newURL:', event.newURL, '\nnewURL:', newURL);
            if (!bool(newURL)) {
                // this prevents the user pressing back to homepage, then route calling HomePage().init() instead of reloading
                elem({tag: 'a'}).attr({href: ``}).click()
            } else {
                Routing.route(<Routing.Page>newURL);
            }
            
            
        },
        load: () => {
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
                    tau: '.tau',
                }
            });
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
    tau: Img;
    
    constructor({query, children}) {
        super({query, children});
        // this.home.pointerdown(() => {
        //     // _startSeparatorAnimation();
        //     // @ts-ignore
        //     window.location = window.location.origin;
        // });
        
        for (let k of Routing.pageStrings()) {
            this[k].pointerdown(() => {
                let href = k === "home" ? '' : `#${k}`;
                console.log(`navbar ${k} pointerdown, clicking fake <a href="${href}">`);
                elem({tag: 'a'}).attr({href}).click();
                // this.select(this[k])
                // routeNew(k);
            })
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
    
    select(child: Div) {
        for (let k of [this.research, this.people, this.publications, this.gallery, this.contact]) {
            k.toggleClass('selected', k === child);
        }
    }
    
    
}

let Navbar; // WindowElem.load =>

/*const Navbar = new NavbarElem({
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

*/
