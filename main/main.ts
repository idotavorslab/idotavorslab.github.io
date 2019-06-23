const isIphone = window.clientInformation.userAgent.includes('iPhone');
const navbar = elem({query: 'navbar'});
const research = navbar.child('.research');
research.pointerdown(() => {
    ResearchPage().sayHi()
});

