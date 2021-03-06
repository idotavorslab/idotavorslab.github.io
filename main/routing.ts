declare namespace Routing {
    type Page = "home" | "research" | "people" | "publications" | "gallery" | "neuroanatomy" | "contact";
    type PageSansHome = Exclude<Routing.Page, "home">;
}
const Routing = (() => {
    
    function getPageObj(key: Routing.PageSansHome): typeof ResearchPage {
        switch (key) {
            case "research":
                return ResearchPage;
            case "people":
                return PeoplePage;
            case "publications":
                return PublicationsPage;
            case "gallery":
                return GalleryPage;
            case "neuroanatomy":
                return NeuroanatomyPage;
            case "contact":
                return ContactPage;
            
        }
    }
    
    function pageStrings(): Routing.Page[] {
        return ["home", "research", "people", "publications", "gallery", "neuroanatomy", "contact"]
    }
    
    
    async function initPage(url: Routing.PageSansHome) {
        console.log(`%cRouting.initPage(url: "${url}")`, `color: ${GOOGLEBLUE}`);
        if (bool(url)) {
            if (pageStrings().slice(1).includes(url)) {
                console.log(`\t%cvalid url ("${url}"), calling pageObj().init()`, `color: ${GOOGLEBLUE}`);
                if (url === "contact") {
                    Body.footer.css({display: 'none'});
                    Body.ugug.class('contact')
                    // Footer.css({display: 'none'});
                } else {
                    Body.ugug.removeClass('contact');
                    Body.footer.uncss('display')
                    // Footer.uncss('display')
                }
                if (url !== "people") {
                    document.getElementById('person_expando')?.remove();
                }
                Body.fundingSection.attr({hidden: ''});
                DocumentElem.allOff();
                const pageObj = getPageObj(url);
                pageObj().init();
                
                await WindowElem.promiseLoaded();
                Navbar.select(Navbar[url]);
                
                
            } else { // bad url, reload to homepage
                console.log(`%cRouting.initPage(), bad url, not in pageStrings(): "${url}". Calling Routing.navigateTo("home")`, `color: ${GOOGLEBLUE}`);
                Routing.navigateTo("home");
            }
        } else {
            // happens when loading localhost:8000 or refreshing at homepage
            console.log('\t%cempty url, calling HomePage().init()', `color: ${GOOGLEBLUE}`);
            HomePage().init();
        }
    }
    
    function navigateTo(url: Routing.Page) {
        if (url.startsWith('#') || url.toLowerCase() !== url) {
            throw new Error(`navigateTo(url) bad url: "${url}"`);
        }
        let href = url === "home" ? '' : `#${url}`;
        console.log(`%cRouting.navigateTo("${url}") clicking fake <a href="${href}">`, `color: ${GOOGLEBLUE}`);
        anchor({href}).appendTo(Body).click().remove(); // no need to select because Routing.route does this
        if (MOBILE && window.scrollY > 0) {
            window.scroll(0, 0);
        }
    }
    
    let lastPage = window.location.hash.slice(1);
    console.log(`%cRouting() root, window.location: ${window.location}\ncalling initPage(lastPage = "${lastPage}")`, `color: ${GOOGLEBLUE}`);
    initPage(<Routing.PageSansHome>lastPage);
    return {initPage, navigateTo, pageStrings}
})();







