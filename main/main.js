const isIphone = window.clientInformation.userAgent.includes('iPhone');
const home = elem({ query: 'home' });
const navbar = elem({
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
navbar.home.pointerdown(() => window.location.reload());
navbar.research.pointerdown(() => ResearchPage().init());
navbar.people.pointerdown(() => PeoplePage().init());
navbar.publications.pointerdown(() => PublicationsPage().init());
//# sourceMappingURL=main.js.map