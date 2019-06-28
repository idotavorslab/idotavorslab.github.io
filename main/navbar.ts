type TNavbarDivChild =
    INavbar["research"]
    | INavbar["people"]
    | INavbar["publications"]
    | INavbar["photos"]
    | INavbar["contact"]

interface INavbar extends Elem {
    home: Img,
    research: Div,
    people: Div,
    publications: Div,
    photos: Div,
    contact: Div,
    tau: Img,
    select: (child: TNavbarDivChild) => void
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
    for (let k of [navbar.research, navbar.people, navbar.publications, navbar.photos, navbar.contact])
        k.toggleClass('selected', k === child);
    
};
