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
    
    
    toggleClass(cls: string, turnOn: boolean): this {
        console.warn(`${this.e.id} | Elem.toggleClass was used. Should test vanilla .toggle function.`);
        const alreadyHasCls = this.e.classList.contains(cls);
        if (turnOn && !alreadyHasCls)
            return this.addClass(cls);
        else if (!turnOn && alreadyHasCls)
            return this.removeClass(cls);
        else
            return this;
        
    }
    
    // **  Nodes
    append(...children: this[]): this {
        for (let child of children)
            this.e.appendChild(child.e);
        return this;
    }
    
    cacheAppend(keyChildObj: TMap<this>): this {
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
    // on(evTypeFnPairs: { abort: (evt) => void }): this
    // on(evTypeFnPairs: TKeyValue<keyof HTMLElementEventMap, EventListenerObject>): this {
    on(evTypeFnPairs: TTElemEvent<TEvent>): this {
        for (let [evType, evFn] of dict(evTypeFnPairs).items())
            this.e.addEventListener(evType, evFn);
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
    fadeOut(dur: number): this {
        if (dur == 0)
            return this.css({opacity: 0});
        let opacity = float(this.e.style.opacity);
        
        if (opacity === undefined || isNaN(opacity)) {
            console.warn('fadeOut htmlElement has NO opacity at all', {
                opacity,
                'this.e': this.e,
                this: this
            });
            return this.css({opacity: 0});
        } else if (opacity <= 0) {
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
                this.css({opacity});
            } else {
                opacity = 0;
                this.css({opacity});
                clearInterval(interval);
            }
        }, everyms);
        return this;
        
    }
    
    fadeIn(dur: number): this {
        if (dur == 0)
            return this.css({opacity: 1});
        let opacity = float(this.e.style.opacity);
        if (opacity == undefined || isNaN(opacity)) {
            console.warn('fadeIn htmlElement has NO opacity at all', {
                opacity,
                'this.e': this.e,
                this: this
            });
            return this.css({opacity: 1});
        } else if (opacity > 1) {
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
                this.css({opacity});
            } else {
                opacity = 1;
                this.css({opacity});
                clearInterval(interval);
            }
        }, everyms);
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
        if (!src)
            throw new Error(`Img constructor didn't receive src`);
        super({tag: 'img', cls});
        if (id)
            this.id(id);
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
