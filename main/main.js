const isIphone = window.clientInformation.userAgent.includes('iPhone');
const home = elem({ query: 'home' });
console.log(home);
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
navbar.research.pointerdown(() => {
    ResearchPage().sayHi();
});
//# sourceMappingURL=main.js.map