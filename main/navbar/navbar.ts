type TNavbarDivChild =
    INavbar["research"]
    | INavbar["people"]
    | INavbar["publications"]
    | INavbar["photos"]
    | INavbar["contact"]

interface INavbar extends BetterHTMLElement {
    home: Img,
    research: Div,
    people: Div,
    publications: Div,
    photos: Div,
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
        photos: '.photos',
        contact: '.contact',
        tau: '.tau',
    }
});

Navbar.select = child => {
    for (let k of [Navbar.research, Navbar.people, Navbar.publications, Navbar.photos, Navbar.contact])
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
