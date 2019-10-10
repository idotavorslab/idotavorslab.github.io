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
    async function route(url) {
        console.log(`%cRouting.route(url: "${url}")`, `color: ${GOOGLEBLUE}`);
        if (bool(url)) {
            if (pageStrings().slice(1).includes(url)) {
                console.log(`\tvalid url ("${url}"), calling pageObj().init()`);
                if (url === "gallery")
                    Footer.attr({ hidden: '' });
                else
                    Footer.removeAttr('hidden');
                FundingSection.attr({ hidden: '' });
                const pageObj = getPageObj(url);
                pageObj().init();
                if (Navbar === undefined) {
                    console.log('route Navbar === undefined, awaiting navbarReady...');
                    await Emitter.until('navbarReady');
                    console.log('route done awaiting navbarReady');
                }
                Navbar.select(Navbar[url]);
            }
            else {
                alert(`bad url, not in pageStrings(): "${url}". calling anchor({href: ''}).click()`);
                anchor({ href: `` }).appendTo(Body).click().remove();
            }
        }
        else {
            console.log('\tempty url, calling HomePage().init()');
            HomePage().init();
        }
    }
    let lastPage = window.location.hash.slice(1);
    console.log(`Routing() root, window.location: ${window.location}\ncalling route(lastPage = "${lastPage}")`);
    route(lastPage);
    return { route, pageStrings };
})();
//# sourceMappingURL=routing.js.map