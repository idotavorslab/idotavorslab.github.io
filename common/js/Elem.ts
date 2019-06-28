class Elem {
    _htmlElement: HTMLElement;
    
    
    constructor(elemOptions: TElemOptions) {
        const {tag, id, htmlElement, text, query, children, cls} = elemOptions;
        
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
    
    // **  Basic
    
    html(html: string): this {
        this._htmlElement.innerHTML = html;
        return this;
    }
    
    text(txt: string): this {
        this.e.innerText = txt;
        return this;
        
    }
    
    id(id: string): this {
        this.e.id = id;
        return this;
    }
    
    css(css: TElemCssOpts): this {
        for (let [styleAttr, styleVal] of dict(css).items())
            this.e.style[<string>styleAttr] = styleVal;
        return this;
    }
    
    class(): string[] {
        return Array.from(this.e.classList);
    }
    
    remove(): this {
        this.e.remove();
        return this;
    }
    
    // **  Classes
    
    
    addClass(cls: string, ...clses: string[]): this {
        this.e.classList.add(cls);
        for (let c of clses)
            this.e.classList.add(c);
        return this;
    }
    
    
    removeClass(cls: string): this {
        this.e.classList.remove(cls);
        return this;
    }
    
    replaceClass(oldToken: string, newToken: string): this {
        this.e.classList.replace(oldToken, newToken);
        return this;
    }
    
    
    setClass(cls: string): this {
        this.e.className = cls;
        return this;
    }
    
    
    toggleClass(cls: string, force?: boolean): this {
        this.e.classList.toggle(cls, force);
        return this;
    }
    
    // **  Nodes
    append(...children: Elem[]): this {
        for (let child of children)
            this.e.appendChild(child.e);
        return this;
    }
    
    cacheAppend(keyChildObj: TMap<Elem>): this {
        for (let [key, child] of dict(keyChildObj).items()) {
            this.e.appendChild(child.e);
            this[key] = child;
        }
        return this;
    }
    
    child(selector: string): Elem {
        return new Elem({htmlElement: this.e.querySelector(selector)});
    }
    
    replaceChild(newChild: this, oldChild: this): this {
        this.e.replaceChild(newChild.e, oldChild.e);
        return this;
    }
    
    children(): Elem[] {
        const childrenVanilla = <HTMLElement[]>Array.from(this.e.children);
        const toElem = (c: HTMLElement) => new Elem({htmlElement: c});
        return childrenVanilla.map(toElem);
    }
    
    cacheChildren(keySelectorObj: TMap<string>) {
        for (let [key, selector] of dict(keySelectorObj).items())
            this[key] = this.child(selector);
        
    }
    
    empty(): this {
        // TODO: is this faster than innerHTML = ""?
        while (this.e.firstChild)
            this.e.removeChild(this.e.firstChild);
        return this;
    }
    
    
    // **  Events
    on(evTypeFnPairs: TEventFunctionMap<TEvent>, options?: AddEventListenerOptions): this {
        for (let [evType, evFn] of dict(evTypeFnPairs).items())
            this.e.addEventListener(evType, evFn, options);
        return this;
    }
    
    
    touchstart(fn: (ev: Event) => any, options?: { once: boolean }): this {
        this.e.addEventListener('touchstart', function _f(ev: Event) {
            ev.preventDefault();
            fn(ev);
            if (options && options.once)
                this.removeEventListener('touchstart', _f);
        });
        return this;
    }
    
    pointerdown(fn: (event: Event) => any, options?: { once: boolean; } | null): this {
        let evType;
        if ("onpointerdown" in window)
            evType = 'pointerdown';
        else // happens in Browserstack Safari, maybe also actual iOS safari
            evType = 'mousedown';
        
        this.e.addEventListener(evType, function _f(ev: Event): void {
            ev.preventDefault();
            fn(ev);
            if (options && options.once)
                this.removeEventListener(evType, _f);
        });
        return this;
    }
    
    
    click(fn, ...args: any[]): this {
        this.e.addEventListener('click', fn);
        return this;
    }
    
    // **  Attributes
    
    attr(attrValPairs: TElemAttrs): this {
        for (let [attr, val] of dict(attrValPairs).items())
            this.e.setAttribute(attr, val);
        return this;
    }
    
    removeAttribute(qualifiedName: string): this {
        this.e.removeAttribute(qualifiedName);
        return this;
    }
    
    data(key: string, parse: boolean = true) {
        const data = this.e.getAttribute(`data-${key}`);
        if (parse)
            return JSON.parse(data);
        else
            return data
    }
    
    // **  Fade
    async fade(dur: number, to: 0 | 1): Promise<this> {
        const styles = window.getComputedStyle(this.e);
        const transProp = styles.transitionProperty.split(', ');
        const indexOfOpacity = transProp.indexOf('opacity');
        // css opacity:0 => transDur[indexOfOpacity]: 0s
        // css opacity:500ms => transDur[indexOfOpacity]: 0.5s
        // css NO opacity => transDur[indexOfOpacity]: undefined
        if (indexOfOpacity !== -1) {
            const transDur = styles.transitionDuration.split(', ');
            const opacityTransDur = transDur[indexOfOpacity];
            const trans = styles.transition.split(', ');
            // transition: opacity was defined in css.
            // set transition to dur, set opacity to 0, leave the animation to native transition, wait dur and return this
            console.warn(`fade(${dur}, ${to}), opacityTransDur !== undefined. nullifying transition. SHOULD NOT WORK`);
            console.log(`trans:\t${trans}\ntransProp:\t${transProp}\nindexOfOpacity:\t${indexOfOpacity}\nopacityTransDur:\t${opacityTransDur}`);
            // trans.splice(indexOfOpacity, 1, `opacity ${dur / 1000}s`);
            trans.splice(indexOfOpacity, 1, `opacity 0s`);
            console.log(`after, trans: ${trans}`);
            this.e.style.transition = trans.join(', ');
            this.css({opacity: to});
            await wait(dur);
            return this;
        }
        // transition: opacity was NOT defined in css.
        if (dur == 0) {
            return this.css({opacity: to});
        }
        const isFadeOut = to === 0;
        let opacity = float(this.e.style.opacity);
        
        if (opacity === undefined || isNaN(opacity)) {
            console.warn(`fade(${dur}, ${to}) htmlElement has NO opacity at all. recursing`, {
                opacity,
                'this.e': this.e,
                this: this
            });
            return this.css({opacity: Math.abs(1 - to)}).fade(dur, to)
        } else {
            
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
        console.log(`fade(${dur}, ${to}) had opacity, no transition. opacity: ${opacity}`, {steps, opStep, everyms});
        const reachedTo = isFadeOut ? (op) => op - opStep > 0 : (op) => op + opStep < 1;
        const interval = setInterval(() => {
            if (reachedTo(opacity)) {
                if (isFadeOut)
                    opacity -= opStep;
                else
                    opacity += opStep;
                this.css({opacity});
            } else {
                opacity = to;
                this.css({opacity});
                clearInterval(interval);
            }
        }, everyms);
        await wait(dur);
        return this;
    }
    
    async fadeOut(dur: number): Promise<this> {
        return await this.fade(dur, 0);
    }
    
    async fadeOutOLD(dur: number): Promise<this> {
        
        const styles = window.getComputedStyle(this.e);
        const trans = styles.transition.split(', ');
        const transProp = styles.transitionProperty.split(', ');
        const indexOfOpacity = transProp.indexOf('opacity');
        // css opacity:0 => transDur[indexOfOpacity]: 0s
        // css opacity:500ms => transDur[indexOfOpacity]: 0.5s
        // css NO opacity => transDur[indexOfOpacity]: undefined
        if (indexOfOpacity !== -1) {
            const transDur = styles.transitionDuration.split(', ');
            const opacityTransDur = transDur[indexOfOpacity];
            // transition: opacity was defined in css.
            // set transition to dur, set opacity to 0, leave the animation to native transition, wait dur and return this
            console.warn('fadeOut, opacityTransDur !== undefined. leveraging transition.');
            console.log(`trans:\t${trans}\ntransProp:\t${transProp}\nindexOfOpacity:\t${indexOfOpacity}\nopacityTransDur:\t${opacityTransDur}`);
            // trans.splice(indexOfOpacity, 1, `opacity ${dur / 1000}s`);
            trans.splice(indexOfOpacity, 1, `opacity 0s`);
            console.log(`after, trans: ${trans}`);
            this.e.style.transition = trans.join(', ');
            this.css({opacity: 0});
            await wait(dur);
            return this;
        }
        // transition: opacity was NOT defined in css.
        if (dur == 0) {
            return this.css({opacity: 0});
        }
        let opacity = float(this.e.style.opacity);
        
        if (opacity === undefined || isNaN(opacity)) {
            console.warn(`fadeOut(${dur}) htmlElement has NO opacity at all. recursing`, {
                opacity,
                'this.e': this.e,
                this: this
            });
            return this.css({opacity: 1}).fadeOut(dur)
        } else if (opacity <= 0) {
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
        console.log(`fadeOut(${dur}) had opacity, no transition. opacity: ${opacity}`, {steps, opDec, everyms});
        const interval = setInterval(() => {
            if (opacity - opDec > 0) {
                opacity -= opDec;
                this.css({opacity});
            } else {
                opacity = 0;
                this.css({opacity});
                clearInterval(interval);
            }
        }, everyms);
        await wait(dur);
        return this;
        
    }
    
    async fadeIn(dur: number): Promise<this> {
        return await this.fade(dur, 1);
    }
    
    async fadeInOLD(dur: number): Promise<this> {
        const styles = window.getComputedStyle(this.e);
        const trans = styles.transition.split(', ');
        const transProp = styles.transitionProperty.split(', ');
        const indexOfOpacity = transProp.indexOf('opacity');
        // css opacity:0 => transDur[indexOfOpacity]: 0s
        // css opacity:500ms => transDur[indexOfOpacity]: 0.5s
        // css NO opacity => transDur[indexOfOpacity]: undefined
        if (indexOfOpacity !== -1) {
            const transDur = styles.transitionDuration.split(', ');
            const opacityTransDur = transDur[indexOfOpacity];
            // transition: opacity was defined in css.
            // set transition to dur, set opacity to 0, leave the animation to native transition, wait dur and return this
            console.warn('fadeIn, opacityTransDur !== undefined. leveraging transition.');
            console.log(`trans:\t${trans}\ntransProp:\t${transProp}\nindexOfOpacity:\t${indexOfOpacity}\nopacityTransDur:\t${opacityTransDur}`);
            // trans.splice(indexOfOpacity, 1, `opacity ${dur / 1000}s`);
            trans.splice(indexOfOpacity, 1, `opacity 0s`);
            console.log(`after, trans: ${trans}`);
            this.e.style.transition = trans.join(', ');
            this.css({opacity: 1});
            await wait(dur);
            return this;
        }
        // transition: opacity was NOT defined in css.
        
        
        if (dur == 0)
            return this.css({opacity: 1});
        let opacity = float(this.e.style.opacity);
        if (opacity == undefined || isNaN(opacity)) {
            console.warn(`fadeIn(${dur}) htmlElement has NO opacity at all. recursing`, {
                opacity,
                'this.e': this.e,
                this: this
            });
            return this.css({opacity: 0}).fadeIn(dur);
        } else if (opacity > 1) {
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
        console.log(`fadeIn(${dur}) had opacity, no transition. opacity: ${opacity}`, {steps, opInc, everyms});
        
        
        const interval = setInterval(() => {
            if (opacity + opInc < 1) {
                opacity += opInc;
                this.css({opacity});
            } else {
                opacity = 1;
                this.css({opacity});
                clearInterval(interval);
            }
        }, everyms);
        await wait(dur);
        return this;
        
    }
    
    
}


class Div extends Elem {
    _htmlElement: HTMLDivElement;
    
    constructor({id, text, cls}: TSubElemOptions = {}) {
        super({tag: "div", text, cls});
        if (id)
            this.id(id);
    }
}

class Span extends Elem {
    _htmlElement: HTMLSpanElement;
    
    constructor({id, text, cls}: TSubElemOptions = {}) {
        super({tag: 'span', text, cls});
        if (id)
            this.id(id);
        
    }
}

class Img extends Elem {
    _htmlElement: HTMLImageElement;
    
    constructor({id, src, cls}: TImgOptions) {
        // if (!src)
        //     throw new Error(`Img constructor didn't receive src`);
        super({tag: 'img', cls});
        if (id)
            this.id(id);
        if (src)
            this._htmlElement.src = src;
        
    }
}


function elem(elemOptions: TElemOptions): Elem {
    return new Elem(elemOptions);
}

function span({id, text, cls}: TSubElemOptions): Span {
    return new Span({id, text, cls});
}

function div({id, text, cls}: TSubElemOptions): Div {
    return new Div({id, text, cls});
}

function img({id, src, cls}: TImgOptions): Img {
    return new Img({id, src, cls});
}
