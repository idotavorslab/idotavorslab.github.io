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
                console.log(`\tvalid url ("${url}"), calling pageObj().init()`);
                
                // happens also in home researchSnippets snippet click
                if (url === "gallery")
                    Footer.attr({hidden: ''});
                else
                    Footer.removeAttr('hidden');
                
                FundingSection.attr({hidden: ''});
                
                const pageObj = getPageObj(url);
                pageObj().init();
                
                if (Navbar === undefined) {
                    console.log('initPage Navbar === undefined, awaiting navbarReady...');
                    await Emitter.until('navbarReady');
                    console.log('initPage done awaiting navbarReady');
                }
                Navbar.select(Navbar[url]);
                
                
            } else { // bad url, reload to homepage
                // alert(`bad url, not in pageStrings(): "${url}". calling anchor({href: ''}).click()`);
                // anchor({href: ``}).appendTo(Body).click().remove();
                console.log(`Routing.initPage(), bad url, not in pageStrings(): "${url}". Calling Routing.navigateTo("home")`);
                Routing.navigateTo("home");
            }
        } else {
            // happens when loading localhost:8000 or refreshing at homepage
            console.log('\tempty url, calling HomePage().init()');
            HomePage().init();
        }
    }
    
    function navigateTo(url: Routing.Page) {
        if (url.startsWith('#')) {
            console.error(`navigateTo(url) bad url:`, url);
            return alert(`navigateTo(url) bad url: ${url}`);
        }
        let href = url === "home" ? '' : `#${url}`;
        console.log(`Routing.navigateTo(url: "${url}") clicking fake <a href="${href}">`);
        anchor({href}).appendTo(Body).click().remove(); // no need to select because Routing.route does this
    }
    
    let lastPage = window.location.hash.slice(1);
    console.log(`Routing() root, window.location: ${window.location}\ncalling initPage(lastPage = "${lastPage}")`);
    initPage(<Routing.PageSansHome>lastPage);
    
    return {initPage, navigateTo, pageStrings}
})();







