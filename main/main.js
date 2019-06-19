const isIphone = window.clientInformation.userAgent.includes('iPhone');
const carouselRight = document.querySelector("body > main > carousel > button.right");
const carouselLeft = document.querySelector("body > main > carousel > button.left");
const carousel = elem({ query: "body > main > carousel" });
const [headline, buttonLeft, buttonRight] = carousel.children();
carousel.on({
    pointerdown: () => {
        console.log(carousel.children());
    },
    mouseover: () => {
        buttonLeft.css({ opacity: 1 });
        buttonRight.css({ opacity: 1 });
    },
    mouseout: () => {
        buttonLeft.css({ opacity: 0 });
        buttonRight.css({ opacity: 0 });
    }
});
//# sourceMappingURL=main.js.map