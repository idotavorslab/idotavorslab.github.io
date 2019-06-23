/*function extend(sup, base) {
    const descriptor = Object.getOwnPropertyDescriptor(
        base.prototype, 'constructor'
    );
    base.prototype = Object.create(sup.prototype); // Person {}
    const handler = {
        construct: function (target, args) {
            const obj = Object.create(base.prototype);
            this.apply(target, obj, args);
            return obj;
        },
        apply: function (target, that, args) {
            sup.apply(that, args);
            base.apply(that, args);
        }
    };
    const proxy = new Proxy(base, handler);
    descriptor.value = proxy;
    Object.defineProperty(base.prototype, 'constructor', descriptor);
    return proxy;
}


function Person(name) {
    this.name = name;
}

function Base(name, age) {
    this.age = age;
}

const Boy = extend(Person, Base);

Boy.prototype.sex = 'M';

const Peter = new Boy('Peter', 13);
console.log(Peter.sex);  // "M"
console.log(Peter.name); // "Peter"
console.log(Peter.age);  // 13
*/
const carouselRight = document.querySelector("body > main > home > carousel > button.right");
const carouselLeft = document.querySelector("body > main > home > carousel > button.left");
const carousel = elem({query: "body > main > home > carousel"});
const [headline, buttonLeft, buttonRight] = carousel.children();
/*carousel.on({
    pointerdown: () => {
        console.log(carousel.children());
    },
    mouseover: () => {
        buttonLeft.css({opacity: 1});
        buttonRight.css({opacity: 1});
    },
    mouseout: () => {
        buttonLeft.css({opacity: 0});
        buttonRight.css({opacity: 0});
    }
});
*/

/*const siema = new Siema({
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
*/
