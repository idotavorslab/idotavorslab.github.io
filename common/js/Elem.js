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
    on(evTypeFnPairs, options) {
        for (let [evType, evFn] of dict(evTypeFnPairs).items())
            this.e.addEventListener(evType, evFn, options);
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
    async fade(dur, to) {
        const styles = window.getComputedStyle(this.e);
        const transProp = styles.transitionProperty.split(', ');
        const indexOfOpacity = transProp.indexOf('opacity');
        if (indexOfOpacity !== -1) {
            const transDur = styles.transitionDuration.split(', ');
            const opacityTransDur = transDur[indexOfOpacity];
            const trans = styles.transition.split(', ');
            console.warn(`fade(${dur}, ${to}), opacityTransDur !== undefined. nullifying transition. SHOULD NOT WORK`);
            console.log(`trans:\t${trans}\ntransProp:\t${transProp}\nindexOfOpacity:\t${indexOfOpacity}\nopacityTransDur:\t${opacityTransDur}`);
            trans.splice(indexOfOpacity, 1, `opacity 0s`);
            console.log(`after, trans: ${trans}`);
            this.e.style.transition = trans.join(', ');
            this.css({ opacity: to });
            await wait(dur);
            return this;
        }
        if (dur == 0) {
            return this.css({ opacity: to });
        }
        const isFadeOut = to === 0;
        let opacity = float(this.e.style.opacity);
        if (opacity === undefined || isNaN(opacity)) {
            console.warn(`fade(${dur}, ${to}) htmlElement has NO opacity at all. recursing`, {
                opacity,
                'this.e': this.e,
                this: this
            });
            return this.css({ opacity: Math.abs(1 - to) }).fade(dur, to);
        }
        else {
            if (isFadeOut ? opacity <= 0 : opacity > 1) {
                console.warn(`fade(${dur}, ${to}) opacity was beyond target opacity. returning this as is.`, {
                    opacity,
                    'this.e': this.e,
                    this: this
                });
                return this;
            }
        }
        let steps = 30;
        let opStep = 1 / steps;
        let everyms = dur / steps;
        if (everyms < 1) {
            everyms = 1;
            steps = dur;
            opStep = 1 / steps;
        }
        console.log(`fade(${dur}, ${to}) had opacity, no transition. opacity: ${opacity}`, { steps, opStep, everyms });
        const reachedTo = isFadeOut ? (op) => op - opStep > 0 : (op) => op + opStep < 1;
        const interval = setInterval(() => {
            if (reachedTo(opacity)) {
                if (isFadeOut)
                    opacity -= opStep;
                else
                    opacity += opStep;
                this.css({ opacity });
            }
            else {
                opacity = to;
                this.css({ opacity });
                clearInterval(interval);
            }
        }, everyms);
        await wait(dur);
        return this;
    }
    async fadeOut(dur) {
        return await this.fade(dur, 0);
    }
    async fadeOutOLD(dur) {
        const styles = window.getComputedStyle(this.e);
        const trans = styles.transition.split(', ');
        const transProp = styles.transitionProperty.split(', ');
        const indexOfOpacity = transProp.indexOf('opacity');
        if (indexOfOpacity !== -1) {
            const transDur = styles.transitionDuration.split(', ');
            const opacityTransDur = transDur[indexOfOpacity];
            console.warn('fadeOut, opacityTransDur !== undefined. leveraging transition.');
            console.log(`trans:\t${trans}\ntransProp:\t${transProp}\nindexOfOpacity:\t${indexOfOpacity}\nopacityTransDur:\t${opacityTransDur}`);
            trans.splice(indexOfOpacity, 1, `opacity 0s`);
            console.log(`after, trans: ${trans}`);
            this.e.style.transition = trans.join(', ');
            this.css({ opacity: 0 });
            await wait(dur);
            return this;
        }
        if (dur == 0) {
            return this.css({ opacity: 0 });
        }
        let opacity = float(this.e.style.opacity);
        if (opacity === undefined || isNaN(opacity)) {
            console.warn(`fadeOut(${dur}) htmlElement has NO opacity at all. recursing`, {
                opacity,
                'this.e': this.e,
                this: this
            });
            return this.css({ opacity: 1 }).fadeOut(dur);
        }
        else if (opacity <= 0) {
            console.warn('fadeOut opacity was lower equal to 0', {
                opacity,
                'this.e': this.e,
                this: this
            });
            return this;
        }
        let steps = 30;
        let opDec = 1 / steps;
        let everyms = dur / steps;
        if (everyms < 1) {
            everyms = 1;
            steps = dur;
            opDec = 1 / steps;
        }
        console.log(`fadeOut(${dur}) had opacity, no transition. opacity: ${opacity}`, { steps, opDec, everyms });
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
        await wait(dur);
        return this;
    }
    async fadeIn(dur) {
        return await this.fade(dur, 1);
    }
    async fadeInOLD(dur) {
        const styles = window.getComputedStyle(this.e);
        const trans = styles.transition.split(', ');
        const transProp = styles.transitionProperty.split(', ');
        const indexOfOpacity = transProp.indexOf('opacity');
        if (indexOfOpacity !== -1) {
            const transDur = styles.transitionDuration.split(', ');
            const opacityTransDur = transDur[indexOfOpacity];
            console.warn('fadeIn, opacityTransDur !== undefined. leveraging transition.');
            console.log(`trans:\t${trans}\ntransProp:\t${transProp}\nindexOfOpacity:\t${indexOfOpacity}\nopacityTransDur:\t${opacityTransDur}`);
            trans.splice(indexOfOpacity, 1, `opacity 0s`);
            console.log(`after, trans: ${trans}`);
            this.e.style.transition = trans.join(', ');
            this.css({ opacity: 1 });
            await wait(dur);
            return this;
        }
        if (dur == 0)
            return this.css({ opacity: 1 });
        let opacity = float(this.e.style.opacity);
        if (opacity == undefined || isNaN(opacity)) {
            console.warn(`fadeIn(${dur}) htmlElement has NO opacity at all. recursing`, {
                opacity,
                'this.e': this.e,
                this: this
            });
            return this.css({ opacity: 0 }).fadeIn(dur);
        }
        else if (opacity > 1) {
            console.warn(`fadeIn(${dur}) opacity was higher than 1`, {
                opacity,
                'this.e': this.e,
                this: this
            });
            return this;
        }
        let steps = 30;
        let opInc = 1 / steps;
        let everyms = dur / steps;
        if (everyms < 1) {
            everyms = 1;
            steps = dur;
            opInc = 1 / steps;
        }
        console.log(`fadeIn(${dur}) had opacity, no transition. opacity: ${opacity}`, { steps, opInc, everyms });
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
        await wait(dur);
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
        super({ tag: 'img', cls });
        if (id)
            this.id(id);
        if (src)
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