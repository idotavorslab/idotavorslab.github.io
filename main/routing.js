const Routing = (() => {
    function getPageObj(key) {
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
    function pageStrings() {
        return ["home", "research", "people", "publications", "gallery", "neuroanatomy", "contact"];
    }
    function route(url) {
        console.log(`%cRouting.route(url: "${url}")`, `color: ${GOOGLEBLUE}`);
        if (bool(url)) {
            if (pageStrings().includes(url)) {
                console.log(`\tvalid url ("${url}"), calling pageObj().init()`);
                if (url === "gallery")
                    Footer.attr({ hidden: '' });
                else
                    Footer.removeAttr('hidden');
                if (url !== "home")
                    FundingSection.attr({ hidden: '' });
                const pageObj = getPageObj(url);
                pageObj().init();
                const selectNavbarItem = () => Navbar.select(Navbar[url]);
                if (Navbar === undefined) {
                    window.onload = selectNavbarItem;
                }
                else {
                    selectNavbarItem();
                }
            }
            else {
                elem({ tag: 'a' }).attr({ href: `` }).click();
            }
        }
        else {
            console.log('\tempty url, calling HomePage().init()');
            HomePage().init();
        }
    }
    let lastPage = window.location.hash.slice(1);
    console.log(`Routing() root, window.location: ${window.location}\ncalling route("${lastPage}")`);
    route(lastPage);
    return { route, pageStrings };
})();
//# sourceMappingURL=routing.js.map