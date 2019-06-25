const isIphone = window.clientInformation.userAgent.includes('iPhone');
const home = elem({query: 'home'});

type TNavbarSpanChild =
    INavbar["research"]
    | INavbar["people"]
    | INavbar["publications"]
    | INavbar["photos"]
    | INavbar["contact"]

interface INavbar extends Elem {
    home: Img,
    research: Span,
    people: Span,
    publications: Span,
    photos: Span,
    contact: Span,
    tau: Img,
    select: (child: TNavbarSpanChild) => void
}

const navbar = <INavbar>elem({
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

navbar.select = child => {
    for (let k of [navbar.research, navbar.people, navbar.publications, navbar.photos, navbar.contact]) {
        if (k === child) {
            k.setClass('selected');
        } else {
            k.removeClass('selected');
        }
    }
};

navbar.home.pointerdown(() => window.location.reload());
navbar.research.pointerdown(() => {
    navbar.select(navbar.research);
    ResearchPage().init();
});
navbar.people.pointerdown(() => {
    navbar.select(navbar.people);
    PeoplePage().init();
});
navbar.publications.pointerdown(() => {
    navbar.select(navbar.publications);
    return PublicationsPage().init();
});

