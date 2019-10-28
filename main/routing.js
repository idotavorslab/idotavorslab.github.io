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
        var _a;
        console.log(`%cRouting.initPage(url: "${url}")`, `color: ${GOOGLEBLUE}`);
        if (bool(url)) {
            if (pageStrings().slice(1).includes(url)) {
                console.log(`\t%cvalid url ("${url}"), calling pageObj().init()`, `color: ${GOOGLEBLUE}`);
                if (url === "contact") {
                    Body.footer.css({ display: 'none' });
                    Body.ugug.class('contact');
                }
                else {
                    Body.ugug.removeClass('contact');
                    Body.footer.uncss('display');
                }
                if (url !== "people") {
                    (_a = document.getElementById('person_expando')) === null || _a === void 0 ? void 0 : _a.remove();
                }
                Body.fundingSection.attr({ hidden: '' });
                DocumentElem.allOff();
                const pageObj = getPageObj(url);
                pageObj().init();
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
        console.log(`%cRouting.navigateTo("${url}") clicking fake <a href="${href}">`, `color: ${GOOGLEBLUE}`);
        anchor({ href }).appendTo(Body).click().remove();
        if (MOBILE && window.scrollY > 0) {
            window.scroll(0, 0);
        }
    }
    let lastPage = window.location.hash.slice(1);
    console.log(`%cRouting() root, window.location: ${window.location}\ncalling initPage(lastPage = "${lastPage}")`, `color: ${GOOGLEBLUE}`);
    initPage(lastPage);
    return { initPage, navigateTo, pageStrings };
})();
//# sourceMappingURL=routing.js.map