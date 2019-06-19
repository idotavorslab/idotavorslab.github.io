const carouselRight = document.querySelector("body > main > carousel > button.right");
const carouselLeft = document.querySelector("body > main > carousel > button.left");
class Elem {
    constructor(elemOptions) {
        const { tag, id, htmlElement, text } = elemOptions;
        if ([tag, id, htmlElement].filter(x => x).length > 1)
            throw new Error(`only tag or id or htmlElement, not more than one, elemOptions: ${elemOptions.keys()}`);
        if (tag)
            this._htmlElement = document.createElement(tag);
        else if (id)
            this._htmlElement = document.getElementById(id);
        else if (htmlElement)
            this._htmlElement = htmlElement;
        else
            throw new Error(`exactly one must be given: tag or id or htmlElement, elemOptions: ${elemOptions.keys()}`);
        if (text)
            this.text(text);
    }
    get e() {
        return this._htmlElement;
    }
    html(html) {
        this._htmlElement.innerHTML = html;
        return this;
    }
    text(txt) {
        this._htmlElement.innerText = txt;
        return this;
    }
    id(id) {
        this._htmlElement.id = id;
        return this;
    }
    css(css) {
        for (let [styleAttr, styleVal] of enumerate(css))
            this._htmlElement.style[styleAttr] = styleVal;
        return this;
    }
    class() {
        return Array.from(this._htmlElement.classList);
    }
    addClass(cls, ...clses) {
        this._htmlElement.classList.add(cls);
        for (let c of clses)
            this._htmlElement.classList.add(c);
        return this;
    }
    removeClass(cls) {
        this._htmlElement.classList.remove(cls);
        return this;
    }
    setClass(cls) {
        this._htmlElement.className = cls;
        return this;
    }
    toggleClass(cls, turnOn) {
        const alreadyHasCls = this._htmlElement.classList.contains(cls);
        if (turnOn && !alreadyHasCls)
            return this.addClass(cls);
        else if (!turnOn && alreadyHasCls)
            return this.removeClass(cls);
        else
            return this;
    }
    append(...children) {
        for (let child of children)
            this._htmlElement.appendChild(child.e);
        return this;
    }
    child(selector) {
        const childrenVanilla = Array.from(this._htmlElement.children);
        if (!selector)
            return new Elem({ htmlElement: childrenVanilla[0] });
        if (selector[0] == '.')
            return new Elem({ htmlElement: childrenVanilla.find(c => c.classList.contains(selector.slice(1))) });
        if (selector[0] == '#')
            return new Elem({ htmlElement: childrenVanilla.find(c => c.id == selector.slice(1)) });
        else
            throw new Error("Not Implemented: selector must start with either a .dot or #hash");
    }
    children(selector) {
        const childrenVanilla = Array.from(this._htmlElement.children);
        const toElem = c => new Elem({ htmlElement: c });
        if (!selector)
            return childrenVanilla.map(toElem);
        if (selector[0] == '.')
            return childrenVanilla.filter(c => c.class().includes(selector.slice(1))).map(toElem);
        else
            throw new Error(`Not Implemented: selector must start with a .dot. selector: ${selector}`);
    }
    on(evTypeFnPairs) {
        for (let [evType, evFn] of enumerate(evTypeFnPairs))
            this._htmlElement.addEventListener(evType, evFn);
        return this;
    }
    touchstart(fn, options) {
        this._htmlElement.addEventListener('touchstart', function _f(ev) {
            ev.preventDefault();
            fn(ev);
            if (options && options.once)
                this.removeEventListener('touchstart', _f);
        });
        return this;
    }
    pointerdown(fn, options) {
        this._htmlElement.addEventListener('pointerdown', function _f(ev) {
            ev.preventDefault();
            fn(ev);
            if (options && options.once)
                this.removeEventListener('pointerdown', _f);
        });
        return this;
    }
    click(fn, ...args) {
        this._htmlElement.addEventListener('click', fn);
        return this;
    }
    attr(attrValPairs) {
        for (let [attr, val] of enumerate(attrValPairs))
            this._htmlElement.setAttribute(attr, val);
        return this;
    }
    removeAttribute(qualifiedName) {
        this._htmlElement.removeAttribute(qualifiedName);
        return this;
    }
    fadeOut(dur) {
        let opacity = float(this._htmlElement.style.opacity);
        if (opacity == undefined)
            return console.error('fadeOut htmlElement has NO opacity at all', { opacity, this: this });
        else if (opacity <= 0)
            return this;
        if (dur == 0)
            return this.css({ opacity: 0 });
        const steps = 10;
        const opDec = 1 / steps;
        const everyms = dur / steps;
        const interval = setInterval(() => {
            if (opacity > 0) {
                opacity -= opDec;
                this.css({ opacity });
            }
            else {
                opacity = 0;
                this.css({ opacity });
                clearInterval(interval);
            }
        }, everyms);
        return this;
    }
    fadeIn(dur) {
        let opacity = float(this._htmlElement.style.opacity);
        if (opacity == undefined)
            return console.error('fadeIn htmlElemtn has NO opacity at all', { opacity, this: this });
        else if (opacity >= 1)
            return this;
        if (dur == 0)
            return this.css({ opacity: 1 });
        const steps = 10;
        const opInc = 1 / steps;
        const everyms = dur / steps;
        const interval = setInterval(() => {
            if (opacity < 1) {
                opacity += opInc;
                this.css({ opacity });
            }
            else {
                opacity = 1;
                this.css({ opacity });
                clearInterval(interval);
            }
        }, everyms);
        return this;
    }
}
class Div extends Elem {
    constructor({ id, text } = {}) {
        super({ tag: 'div', text });
        if (id)
            this.id(id);
    }
}
class Span extends Elem {
    constructor({ id, text } = {}) {
        super({ tag: 'span', text });
        if (id)
            this.id(id);
    }
}
class Img extends Elem {
    constructor({ id, src }) {
        super({ tag: 'img' });
        if (id)
            this.id(id);
        this._htmlElement.src = src;
    }
}
