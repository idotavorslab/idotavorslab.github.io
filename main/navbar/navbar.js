const Navbar = elem({
    query: 'navbar',
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
const separators = elem({ query: 'separators', children: { left: '.left', right: '.right' } });
function linearGradient(opac_stop_1, opac_stop_2) {
    return `linear-gradient(90deg, rgba(0, 0, 0, ${opac_stop_1[0]}) ${opac_stop_1[1]}, rgba(0, 0, 0, ${opac_stop_2[0]}) ${opac_stop_2[1]})`;
}
function startSeparatorAnimation() {
    console.log('startSeparatorAnimation()');
    TL.fromTo(separators.left.e, 1, { backgroundImage: linearGradient([0, '0%'], [0.15, '150%']) }, {
        backgroundImage: linearGradient([0, '0%'], [0.75, '10%']),
    });
    TL.fromTo(separators.right.e, 1, { backgroundImage: linearGradient([0.15, '-50%'], [0, '100%']) }, {
        backgroundImage: linearGradient([0.75, '90%'], [0, '100%']),
    });
}
function killSeparatorAnimation() {
    console.log('killSeparatorAnimation()');
    TL.killTweensOf([separators.left.e, separators.right.e]);
    separators.left.css({ backgroundImage: linearGradient([0, '0%'], [0.1, '10%']) });
    separators.right.css({ backgroundImage: linearGradient([0.1, '90%'], [0, '100%']) });
}
async function gotoPage(page) {
    startSeparatorAnimation();
    await page().init();
    killSeparatorAnimation();
}
Navbar.select = (child) => {
    for (let k of [Navbar.research, Navbar.people, Navbar.publications, Navbar.gallery, Navbar.contact])
        k.toggleClass('selected', k === child);
};
Navbar.home.pointerdown(() => {
    startSeparatorAnimation();
    window.location.reload();
});
Navbar.research.pointerdown(() => {
    gotoPage(ResearchPage);
});
Navbar.people.pointerdown(async () => {
    gotoPage(PeoplePage);
});
Navbar.publications.pointerdown(async () => {
    gotoPage(PublicationsPage);
});
Navbar.gallery.pointerdown(async () => {
    gotoPage(GalleryPage);
});
//# sourceMappingURL=navbar.js.map