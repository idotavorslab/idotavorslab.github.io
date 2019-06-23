class Elem {
    constructor(elemOptions) {
        const { tag, id, htmlElement, text, query, children } = elemOptions;
        if ([tag, id, htmlElement, query].filter(x => x).length > 1)
            throw new Error(`Received more than one, pass exactly one of: [tag, id, htmlElement, query], ${{
                tag,
                id,
                htmlElement,
                query
            }}`);
        if (tag)
            this._htmlElement = document.createElement(tag);
        else if (id)
            this._htmlElement = document.getElementById(id);
        else if (query)
            this._htmlElement = document.querySelector(query);
        else if (htmlElement)
            this._htmlElement = htmlElement;
        else
            throw new Error(`Didn't receive one, pass exactly one of: [tag, id, htmlElement, query], ${{
                tag,
                id,
                htmlElement,
                query
            }}`);
        if (text !== undefined)
            this.text(text);
        if (children !== undefined) {
            if (tag)
                throw new Error(`Received children and tag, impossible since tag implies creating a new element and children implies getting an existing one. ${{
                    tag,
                    id,
                    htmlElement,
                    text,
                    query,
                    children
                }}`);
            this.cacheChildren(children);
        }
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
    remove() {
        this._htmlElement.remove();
        return this;
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
    replaceClass(oldToken, newToken) {
        this._htmlElement.classList.replace(oldToken, newToken);
        return this;
    }
    setClass(cls) {
        this._htmlElement.className = cls;
        return this;
    }
    toggleClass(cls, turnOn) {
        console.warn(`${this.e.id} | Elem.toggleClass was used. Should test vanilla .toggle function.`);
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
        return new Elem({ htmlElement: this._htmlElement.querySelector(selector) });
    }
    children() {
        const childrenVanilla = Array.from(this._htmlElement.children);
        const toElem = (c) => new Elem({ htmlElement: c });
        return childrenVanilla.map(toElem);
    }
    cacheChildren(keySelectorObj) {
        for (let [k, s] of dict(keySelectorObj).items()) {
            this[k] = this.child(s);
        }
    }
    empty() {
        while (this.e.firstChild)
            this.e.removeChild(this.e.firstChild);
        return this;
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
        let evType;
        if ("onpointerdown" in window)
            evType = 'pointerdown';
        else
            evType = 'mousedown';
        this._htmlElement.addEventListener(evType, function _f(ev) {
            ev.preventDefault();
            fn(ev);
            if (options && options.once)
                this.removeEventListener(evType, _f);
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
    data(key, parse = true) {
        const data = this._htmlElement.getAttribute(`data-${key}`);
        if (parse)
            return JSON.parse(data);
        else
            return data;
    }
    fadeOut(dur) {
        if (dur == 0)
            return this.css({ opacity: 0 });
        let opacity = float(this._htmlElement.style.opacity);
        if (opacity === undefined || isNaN(opacity)) {
            console.warn('fadeOut htmlElement has NO opacity at all', {
                opacity,
                'this._htmlElement': this._htmlElement,
                this: this
            });
            return this.css({ opacity: 0 });
        }
        else if (opacity <= 0) {
            console.warn('fadeOut opacity was lower than 0', {
                opacity,
                'this._htmlElement': this._htmlElement,
                this: this
            });
            return this;
        }
        const steps = 20;
        const opDec = 1 / steps;
        const everyms = dur / steps;
        const interval = setInterval(() => {
            if (opacity - opDec > 0) {
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
        if (dur == 0)
            return this.css({ opacity: 1 });
        let opacity = float(this._htmlElement.style.opacity);
        if (opacity == undefined || isNaN(opacity)) {
            console.warn('fadeIn htmlElement has NO opacity at all', {
                opacity,
                'this._htmlElement': this._htmlElement,
                this: this
            });
            return this.css({ opacity: 1 });
        }
        else if (opacity > 1) {
            console.warn('fadeIn opacity was higher than 0', {
                opacity,
                'this._htmlElement': this._htmlElement,
                this: this
            });
            return this;
        }
        const steps = 20;
        const opInc = 1 / steps;
        const everyms = dur / steps;
        const interval = setInterval(() => {
            if (opacity + opInc < 1) {
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
        super({ tag: "div", text });
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
function elem(elemOptions) {
    return new Elem(elemOptions);
}
function div({ id, text } = {}) {
    return new Div({ id, text });
}
//# sourceMappingURL=Elem.js.map