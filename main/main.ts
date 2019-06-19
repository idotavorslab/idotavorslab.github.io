function extend(sup, base) {
    const descriptor = Object.getOwnPropertyDescriptor(
        base.prototype, 'constructor'
    );
    base.prototype = Object.create(sup.prototype);
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

const Boy = extend(Person, function (name, age) {
    this.age = age;
});

Boy.prototype.sex = 'M';

const Peter = new Boy('Peter', 13);
console.log(Peter.sex);  // "M"
console.log(Peter.name); // "Peter"
console.log(Peter.age);  // 13


/*const carouselRight = document.querySelector("body > main > carousel > button.right");
const carouselLeft = document.querySelector("body > main > carousel > button.left");

const isIphone = window.clientInformation.userAgent.includes('iPhone');
const items = ['table', 'pizza', 'glass'];
for (let [i, item] of enumerate(items)) {

}
*/
