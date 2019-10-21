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
    async function initPage(url) {
        console.log(`%cRouting.initPage(url: "${url}")`, `color: ${GOOGLEBLUE}`);
        if (bool(url)) {
            if (pageStrings().slice(1).includes(url)) {
                console.log(`\t%cvalid url ("${url}"), calling pageObj().init()`, `color: ${GOOGLEBLUE}`);
                if (url === "contact") {
                    Footer.css({ display: 'none' });
                }
                else {
                    Footer.uncss('display');
                }
                FundingSection.attr({ hidden: '' });
                DocumentElem.allOff();
                const pageObj = getPageObj(url);
                pageObj().init();
                if (Navbar === undefined)
                    await WindowElem.promiseLoaded();
                Navbar.select(Navbar[url]);
            }
            else {
                console.log(`%cRouting.initPage(), bad url, not in pageStrings(): "${url}". Calling Routing.navigateTo("home")`, `color: ${GOOGLEBLUE}`);
                Routing.navigateTo("home");
            }
        }
        else {
            console.log('\t%cempty url, calling HomePage().init()', `color: ${GOOGLEBLUE}`);
            HomePage().init();
        }
    }
    function navigateTo(url) {
        if (url.startsWith('#') || url.toLowerCase() !== url) {
            throw new Error(`navigateTo(url) bad url: "${url}"`);
        }
        let href = url === "home" ? '' : `#${url}`;
        console.log(`%cRouting.navigateTo(url: "${url}") clicking fake <a href="${href}">`, `color: ${GOOGLEBLUE}`);
        anchor({ href }).appendTo(Body).click().remove();
    }
    let lastPage = window.location.hash.slice(1);
    console.log(`%cRouting() root, window.location: ${window.location}\ncalling initPage(lastPage = "${lastPage}")`, `color: ${GOOGLEBLUE}`);
    initPage(lastPage);
    return { initPage, navigateTo, pageStrings };
})();
//# sourceMappingURL=routing.js.map