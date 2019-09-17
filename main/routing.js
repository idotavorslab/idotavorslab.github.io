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
        }
    }
    function route(url) {
        console.log(`route("${url}")`);
        if (bool(url)) {
            if (["research", "people", "publications", "gallery", "contact"].includes(url)) {
                console.log('\tvalid url, calling pageObj().init()');
                if (url === "gallery")
                    Footer.attr({ hidden: '' });
                else
                    Footer.removeAttr('hidden');
                const pageObj = getPageObj(url);
                pageObj().init();
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
    console.log(`document root, window.location: ${window.location}\ncalling route("${lastPage}")`);
    route(lastPage);
    return { route };
})();
//# sourceMappingURL=routing.js.map