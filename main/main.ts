const isIphone = window.clientInformation.userAgent.includes('iPhone');

const navbar = elem({query: 'navbar'});
navbar.cacheChildren({research: '.research'});
const research = navbar.child('.research');
research.pointerdown(() => {
    ResearchPage().sayHi()
});

