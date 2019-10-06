const isIphone = window.navigator.userAgent.includes('iPhone');

// @ts-ignore
const DocumentElem = elem({htmlElement: document});
const Body = elem({htmlElement: document.body});
const Home = elem({id: 'home'});


const CacheDiv = elem({id: 'cache'});
// @ts-ignore
const WindowElem = elem({htmlElement: window})
    .on({
        scroll: (event: Event) => {
            if (Navbar !== undefined) {
                if (window.scrollY > 0) {
                    Navbar.removeClass('box-shadow')
                } else {
                    Navbar.addClass('box-shadow')
                    
                }
            }
            
        },
        hashchange: (event: HashChangeEvent) => {
            // called on navbar click, backbutton click
            const newURL = event.newURL.replace(window.location.origin + window.location.pathname, "").replace('#', '');
            if (!bool(newURL)) {
                // this prevents the user pressing back to homepage, then route calling HomePage().init() instead of reloading
                elem({tag: 'a'}).attr({href: ``}).click()
            } else {
                console.log(`hash change, event.newURL: "${event.newURL}"\nnewURL: "${newURL}"`);
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
                }
            });
            console.group(`window loaded, window.location.hash: "${window.location.hash}"`);
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
                            console.log(...less(`loaded ${page} | ${file}`));
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
                console.log('done caching');
                console.groupEnd();
            });
            
        }
    });

interface IFooter extends Div {
    contact: Div & {
        address: Div;
        'phone-email': Div;
        map: Div
    }
}

const Footer: IFooter = <IFooter>elem({
    id: 'footer', children: {
        contact: {'#contact': {address: '.address', 'phone-email': '.phone-email', map: '.map'}},
        logos: '#logos'
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
        // this.home.pointerdown(() => {
        //     // _startSeparatorAnimation();
        //     // @ts-ignore
        //     window.location = window.location.origin;
        // });
        
        for (let pageString of Routing.pageStrings()) {
            this[pageString]
                .pointerdown(() => {
                    let href = pageString === "home" ? '' : `#${pageString}`;
                    console.log(`navbar ${pageString} pointerdown, clicking fake <a href="${href}">`);
                    anchor({href}).click(); // no need to select because Routing.route does this
                    // elem({tag: 'a'}).attr({href}).click();
                })
                .mouseover(() => this._emphasize(<Div>this[pageString]))
                .mouseout(() => this._resetPales());
        }
        
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

Footer.append(
    elem({tag: 'iframe'})
        .id('contact_map')
        .attr({
            frameborder: "0",
            allowfullscreen: "",
            src: "https://bit.ly/2mGwkNo"
        }),
    div({id: 'gilad'}).html(`2019
        Developed by <a href="http://giladbarnea.github.io">Gilad Barnea</a>`)
);
type TContactData = {
    visit: { address: string, link: string, icon: string },
    call: { hours: string, phone: string, icon: string },
    email: { address: string, icon: string, }
    map: string,
    form: string
};
fetchDict<TContactData>("main/contact/contact.json").then(data => {
    Footer.contact.address.append(anchor({href: data.visit.link, text: data.visit.address}).target("_blank"));
    Footer.contact["phone-email"].append(paragraph().html(`Phone:
                                                        <a href="tel:${data.call.phone}">${data.call.phone}</a><br>
                                                        Email:
                                                        <a href="mailto:${data.email.address}">${data.email.address}</a>`))
});
