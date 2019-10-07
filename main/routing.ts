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
    
    
    function route(url: Routing.PageSansHome) {
        console.log(`%cRouting.route(url: "${url}")`, `color: ${GOOGLEBLUE}`);
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
                const selectNavbarItem = () => Navbar.select(Navbar[url]);
                if (Navbar === undefined) {
                    // happens when refreshing to a #page
                    window.onload = selectNavbarItem
                } else {
                    // happens when navigating through navbar
                    selectNavbarItem()
                }
                
            } else { // bad url, reload to homepage
                alert(`bad url, not in pageStrings(): "${url}". calling anchor({href: ''}).click()`);
                anchor({href: ``}).click();
            }
        } else {
            // happens when loading localhost:8000 or refreshing at homepage
            console.log('\tempty url, calling HomePage().init()');
            HomePage().init();
        }
    }
    
    let lastPage = window.location.hash.slice(1);
    console.log(`Routing() root, window.location: ${window.location}\ncalling route(lastPage = "${lastPage}")`);
    route(<Routing.PageSansHome>lastPage);
    return {route, pageStrings}
})();







