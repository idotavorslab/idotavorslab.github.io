const isIphone = window.clientInformation.userAgent.includes('iPhone');
const Home = elem({ query: 'home' });
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
//# sourceMappingURL=main.js.map