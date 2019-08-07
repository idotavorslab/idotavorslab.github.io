type TNavbarDivChild =
    INavbar["research"]
    | INavbar["people"]
    | INavbar["publications"]
    | INavbar["gallery"]
    | INavbar["contact"]

interface INavbar extends BetterHTMLElement {
    home: Img,
    research: Div,
    people: Div,
    publications: Div,
    gallery: Div,
    contact: Div,
    tau: Img,
    select: (child: TNavbarDivChild) => void
}

const Navbar = <INavbar>elem({
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

Navbar.select = child => {
    for (let k of [Navbar.research, Navbar.people, Navbar.publications, Navbar.gallery, Navbar.contact])
        k.toggleClass('selected', k === child);
    
};
Navbar.home.pointerdown(() => window.location.reload());
Navbar.research.pointerdown(() => {
    
    ResearchPage().init();
});
Navbar.people.pointerdown(() => {
    
    PeoplePage().init();
});
Navbar.publications.pointerdown(() => {
    
    return PublicationsPage().init();
});
