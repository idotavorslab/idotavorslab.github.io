const isIphone = window.clientInformation.userAgent.includes('iPhone');
const carouselRight = document.querySelector("body > main > carousel > button.right");
const carouselLeft = document.querySelector("body > main > carousel > button.left");
const carousel = elem({ query: "body > main > carousel" });
const [headline, buttonLeft, buttonRight] = carousel.children();
//# sourceMappingURL=main.js.map