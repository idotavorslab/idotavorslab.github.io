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
navbar.select = child => {
    for (let k of [navbar.research, navbar.people, navbar.publications, navbar.photos, navbar.contact])
        k.toggleClass('selected', k === child);
};
//# sourceMappingURL=navbar.js.map