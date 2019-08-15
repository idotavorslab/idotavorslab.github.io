type TNavbarDivChild =
    INavbar["research"]
    | INavbar["people"]
    | INavbar["publications"]
    | INavbar["gallery"]
    | INavbar["contact"]

interface INavbar extends BetterHTMLElement {
    home: Img,
    research: Div,
    people: Div,
    publications: Div,
    gallery: Div,
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
        gallery: '.gallery',
        contact: '.contact',
        tau: '.tau',
    }
});

interface ISeparators extends BetterHTMLElement {
    right: BetterHTMLElement,
    left: BetterHTMLElement,
}

const separators = <ISeparators>elem({query: 'separators', children: {left: '.left', right: '.right'}});
// const separators = document.getElementsByTagName('separators');
// const separatorLeft = elem({htmlElement: <HTMLElement>separators.item(0)});
// const separatorRight = elem({htmlElement: <HTMLElement>separators.item(1)});

function linearGradient(opac_stop_1: [number, string], opac_stop_2: [number, string]) {
    return `linear-gradient(90deg, rgba(0, 0, 0, ${opac_stop_1[0]}) ${opac_stop_1[1]}, rgba(0, 0, 0, ${opac_stop_2[0]}) ${opac_stop_2[1]})`
}

function startSeparatorAnimation() {
    
    console.log('startSeparatorAnimation()');
    const tl = TL.fromTo(separators.left.e, 1, {backgroundImage: linearGradient([0, '0%'], [0.15, '150%'])}, {
        backgroundImage: linearGradient([0, '0%'], [0.75, '10%']),
    });
    
    TL.fromTo(separators.right.e, 1, {backgroundImage: linearGradient([0.15, '-50%'], [0, '100%'])}, {
        backgroundImage: linearGradient([0.75, '90%'], [0, '100%']),
    });
    
}

function killSeparatorAnimation() {
    console.log('killSeparatorAnimation()');
    TL.killTweensOf([separators.left.e, separators.right.e]);
    separators.left.css({backgroundImage: linearGradient([0, '0%'], [0.1, '10%'])});
    separators.right.css({backgroundImage: linearGradient([0.1, '90%'], [0, '100%'])});
}

Navbar.select = (child) => {
    for (let k of [Navbar.research, Navbar.people, Navbar.publications, Navbar.gallery, Navbar.contact])
        k.toggleClass('selected', k === child);
    
    
};
Navbar.home.pointerdown(() => {
    startSeparatorAnimation();
    window.location.reload();
});
Navbar.research.pointerdown(async () => {
    
    startSeparatorAnimation();
    await ResearchPage().init();
    killSeparatorAnimation();
    
    
});
Navbar.people.pointerdown(async () => {
    startSeparatorAnimation();
    await PeoplePage().init();
    killSeparatorAnimation();
});
Navbar.publications.pointerdown(async () => {
    startSeparatorAnimation();
    await PublicationsPage().init();
    killSeparatorAnimation();
});
