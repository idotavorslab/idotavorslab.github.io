class Elem {
    constructor(elemOptions) {
        const { tag, id, htmlElement, text, query, children, cls } = elemOptions;
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
        if (cls !== undefined)
            this.setClass(cls);
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
        this.e.innerText = txt;
        return this;
    }
    id(id) {
        this.e.id = id;
        return this;
    }
    css(css) {
        for (let [styleAttr, styleVal] of dict(css).items())
            this.e.style[styleAttr] = styleVal;
        return this;
    }
    class() {
        return Array.from(this.e.classList);
    }
    remove() {
        this.e.remove();
        return this;
    }
    addClass(cls, ...clses) {
        this.e.classList.add(cls);
        for (let c of clses)
            this.e.classList.add(c);
        return this;
    }
    removeClass(cls) {
        this.e.classList.remove(cls);
        return this;
    }
    replaceClass(oldToken, newToken) {
        this.e.classList.replace(oldToken, newToken);
        return this;
    }
    setClass(cls) {
        this.e.className = cls;
        return this;
    }
    toggleClass(cls, force) {
        this.e.classList.toggle(cls, force);
        return this;
    }
    append(...children) {
        for (let child of children)
            this.e.appendChild(child.e);
        return this;
    }
    cacheAppend(keyChildObj) {
        for (let [key, child] of dict(keyChildObj).items()) {
            this.e.appendChild(child.e);
            this[key] = child;
        }
        return this;
    }
    child(selector) {
        return new Elem({ htmlElement: this.e.querySelector(selector) });
    }
    replaceChild(newChild, oldChild) {
        this.e.replaceChild(newChild.e, oldChild.e);
        return this;
    }
    children() {
        const childrenVanilla = Array.from(this.e.children);
        const toElem = (c) => new Elem({ htmlElement: c });
        return childrenVanilla.map(toElem);
    }
    cacheChildren(keySelectorObj) {
        for (let [key, selector] of dict(keySelectorObj).items())
            this[key] = this.child(selector);
    }
    empty() {
        while (this.e.firstChild)
            this.e.removeChild(this.e.firstChild);
        return this;
    }
    on(evTypeFnPairs) {
        for (let [evType, evFn] of dict(evTypeFnPairs).items())
            this.e.addEventListener(evType, evFn);
        return this;
    }
    touchstart(fn, options) {
        this.e.addEventListener('touchstart', function _f(ev) {
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
        this.e.addEventListener(evType, function _f(ev) {
            ev.preventDefault();
            fn(ev);
            if (options && options.once)
                this.removeEventListener(evType, _f);
        });
        return this;
    }
    click(fn, ...args) {
        this.e.addEventListener('click', fn);
        return this;
    }
    attr(attrValPairs) {
        for (let [attr, val] of dict(attrValPairs).items())
            this.e.setAttribute(attr, val);
        return this;
    }
    removeAttribute(qualifiedName) {
        this.e.removeAttribute(qualifiedName);
        return this;
    }
    data(key, parse = true) {
        const data = this.e.getAttribute(`data-${key}`);
        if (parse)
            return JSON.parse(data);
        else
            return data;
    }
    fadeOut(dur) {
        if (dur == 0)
            return this.css({ opacity: 0 });
        let opacity = float(this.e.style.opacity);
        if (opacity === undefined || isNaN(opacity)) {
            console.warn('fadeOut htmlElement has NO opacity at all', {
                opacity,
                'this.e': this.e,
                this: this
            });
            return this.css({ opacity: 0 });
        }
        else if (opacity <= 0) {
            console.warn('fadeOut opacity was lower than 0', {
                opacity,
                'this.e': this.e,
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
        let opacity = float(this.e.style.opacity);
        if (opacity == undefined || isNaN(opacity)) {
            console.warn('fadeIn htmlElement has NO opacity at all', {
                opacity,
                'this.e': this.e,
                this: this
            });
            return this.css({ opacity: 1 });
        }
        else if (opacity > 1) {
            console.warn('fadeIn opacity was higher than 0', {
                opacity,
                'this.e': this.e,
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
    constructor({ id, text, cls } = {}) {
        super({ tag: "div", text, cls });
        if (id)
            this.id(id);
    }
}
class Span extends Elem {
    constructor({ id, text, cls } = {}) {
        super({ tag: 'span', text, cls });
        if (id)
            this.id(id);
    }
}
class Img extends Elem {
    constructor({ id, src, cls }) {
        if (!src)
            throw new Error(`Img constructor didn't receive src`);
        super({ tag: 'img', cls });
        if (id)
            this.id(id);
        this._htmlElement.src = src;
    }
}
function elem(elemOptions) {
    return new Elem(elemOptions);
}
function span({ id, text, cls }) {
    return new Span({ id, text, cls });
}
function div({ id, text, cls }) {
    return new Div({ id, text, cls });
}
function img({ id, src, cls }) {
    return new Img({ id, src, cls });
}
//# sourceMappingURL=Elem.js.map