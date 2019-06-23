const isIphone = window.clientInformation.userAgent.includes('iPhone');
const navbar = elem({ query: 'navbar' });
navbar.cacheChildren({
    home: '.home',
    research: '.research',
    people: '.people',
    publications: '.publications',
    photos: '.photos',
    contact: '.contact',
    tau: '.tau',
});
navbar.research.pointerdown(() => {
    ResearchPage().sayHi();
});
//# sourceMappingURL=main.js.map