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
Navbar.select = (child) => {
    for (let k of [Navbar.research, Navbar.people, Navbar.publications, Navbar.gallery, Navbar.contact])
        k.toggleClass('selected', k === child);
};
Navbar.home.pointerdown(() => window.location.reload());
Navbar.research.pointerdown(async () => {
    const separators = document.getElementsByTagName('separator');
    const separatorLeft = separators.item(0);
    const separatorRight = separators.item(1);
    function linearGradient(opac_stop_1, opac_stop_2) {
        return `linear-gradient(90deg, rgba(0, 0, 0, ${opac_stop_1[0]}) ${opac_stop_1[1]}, rgba(0, 0, 0, ${opac_stop_2[0]}) ${opac_stop_2[1]})`;
    }
    TL.fromTo(separatorLeft, 1, { backgroundImage: linearGradient([0, '0%'], [0.25, '150%']) }, {
        backgroundImage: linearGradient([0, '0%'], [0.5, '10%']),
    });
    TL.fromTo(separatorRight, 1, { backgroundImage: linearGradient([0.25, '-50%'], [0, '100%']) }, {
        backgroundImage: linearGradient([0.5, '90%'], [0, '100%']),
    });
});
Navbar.people.pointerdown(() => {
    PeoplePage().init();
});
Navbar.publications.pointerdown(() => {
    PublicationsPage().init();
});
//# sourceMappingURL=navbar.js.map