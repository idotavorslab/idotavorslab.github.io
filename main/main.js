const carouselRight = document.querySelector("body > main > carousel > button.right");
const carouselLeft = document.querySelector("body > main > carousel > button.left");
const isIphone = window.clientInformation.userAgent.includes('iPhone');
const siema = new Siema({
    selector: '.siema',
    duration: 200,
    easing: 'ease-out',
    perPage: 1,
    startIndex: 0,
    draggable: true,
    multipleDrag: true,
    threshold: 20,
    loop: false,
    rtl: false,
    onInit: () => {
    },
    onChange: () => {
    },
});
console.log({ siema });
//# sourceMappingURL=main.js.map