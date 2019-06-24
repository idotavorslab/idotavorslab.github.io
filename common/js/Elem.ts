class Elem {
    _htmlElement: HTMLElement;
    
    constructor(elemOptions: IElemOptions) {
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
    
    get e(): HTMLElement {
        return this._htmlElement;
    }
    
    // **  Basic
    
    html(html: string): Elem {
        this._htmlElement.innerHTML = html;
        return this;
    }
    
    text(txt: string): Elem {
        this._htmlElement.innerText = txt;
        return this;
        
    }
    
    id(id: string): Elem {
        this._htmlElement.id = id;
        return this;
    }
    
    css(css: IElemCssOpts): Elem {
        for (let [styleAttr, styleVal] of enumerate(css))
            this._htmlElement.style[styleAttr] = styleVal;
        return this;
    }
    
    class(): string[] {
        return Array.from(this._htmlElement.classList);
    }
    
    remove(): Elem {
        this._htmlElement.remove();
        return this;
    }
    
    // **  Classes
    
    
    addClass(cls: string, ...clses: string[]): Elem {
        this._htmlElement.classList.add(cls);
        for (let c of clses)
            this._htmlElement.classList.add(c);
        return this;
    }
    
    
    removeClass(cls: string): Elem {
        this._htmlElement.classList.remove(cls);
        return this;
    }
    
    replaceClass(oldToken: string, newToken: string) {
        this._htmlElement.classList.replace(oldToken, newToken);
        return this;
    }
    
    
    setClass(cls: string): Elem {
        this._htmlElement.className = cls;
        return this;
    }
    
    
    toggleClass(cls: string, turnOn: boolean): Elem {
        console.warn(`${this.e.id} | Elem.toggleClass was used. Should test vanilla .toggle function.`);
        const alreadyHasCls = this._htmlElement.classList.contains(cls);
        if (turnOn && !alreadyHasCls)
            return this.addClass(cls);
        else if (!turnOn && alreadyHasCls)
            return this.removeClass(cls);
        else
            return this;
        
    }
    
    // **  Nodes
    append(...children: Elem[]): Elem {
        for (let child of children)
            this._htmlElement.appendChild(child.e);
        return this;
    }
    
    child(selector: string): Elem {
        return new Elem({htmlElement: this._htmlElement.querySelector(selector)});
    }
    
    replaceChild(newChild: Elem, oldChild: Elem): Elem {
        this._htmlElement.replaceChild(newChild._htmlElement, oldChild._htmlElement);
        return this;
    }
    
    children(): Elem[] {
        const childrenVanilla = <HTMLElement[]>Array.from(this._htmlElement.children);
        const toElem = (c: HTMLElement) => new Elem({htmlElement: c});
        return childrenVanilla.map(toElem);
    }
    
    cacheChildren(keySelectorObj) {
        for (let [k, s] of dict(keySelectorObj).items())
            this[k] = this.child(s);
        
    }
    
    empty() {
        // TODO: is this faster than innerHTML = ""?
        while (this._htmlElement.firstChild)
            this._htmlElement.removeChild(this._htmlElement.firstChild);
        return this;
    }
    
    
    // **  Events
    on(evTypeFnPairs): Elem {
        for (let [evType, evFn] of enumerate(evTypeFnPairs))
            this._htmlElement.addEventListener(evType, evFn);
        return this;
    }
    
    
    touchstart(fn: (ev: Event) => any, options?: { once: boolean }): Elem {
        this._htmlElement.addEventListener('touchstart', function _f(ev: Event) {
            ev.preventDefault();
            fn(ev);
            if (options && options.once)
                this.removeEventListener('touchstart', _f);
        });
        return this;
    }
    
    pointerdown(fn: (event: Event) => any, options?: { once: boolean; } | null): Elem {
        let evType;
        if ("onpointerdown" in window)
            evType = 'pointerdown';
        else // happens in Browserstack Safari, maybe also actual iOS safari
            evType = 'mousedown';
        
        this._htmlElement.addEventListener(evType, function _f(ev: Event): void {
            ev.preventDefault();
            fn(ev);
            if (options && options.once)
                this.removeEventListener(evType, _f);
        });
        return this;
    }
    
    
    click(fn, ...args: any[]): Elem {
        this._htmlElement.addEventListener('click', fn);
        return this;
    }
    
    // **  Attributes
    
    attr(attrValPairs): Elem {
        for (let [attr, val] of enumerate(attrValPairs))
            this._htmlElement.setAttribute(attr, val);
        return this;
    }
    
    removeAttribute(qualifiedName: string): Elem {
        this._htmlElement.removeAttribute(qualifiedName);
        return this;
    }
    
    data(key: string, parse: boolean = true) {
        const data = this._htmlElement.getAttribute(`data-${key}`);
        if (parse)
            return JSON.parse(data);
        else
            return data
    }
    
    // **  Fade
    fadeOut(dur: number): Elem {
        if (dur == 0)
            return this.css({opacity: 0});
        let opacity = float(this._htmlElement.style.opacity);
        
        if (opacity === undefined || isNaN(opacity)) {
            console.warn('fadeOut htmlElement has NO opacity at all', {
                opacity,
                'this._htmlElement': this._htmlElement,
                this: this
            });
            return this.css({opacity: 0});
        } else if (opacity <= 0) {
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
                this.css({opacity});
            } else {
                opacity = 0;
                this.css({opacity});
                clearInterval(interval);
            }
        }, everyms);
        return this;
        
    }
    
    fadeIn(dur: number): Elem {
        if (dur == 0)
            return this.css({opacity: 1});
        let opacity = float(this._htmlElement.style.opacity);
        if (opacity == undefined || isNaN(opacity)) {
            console.warn('fadeIn htmlElement has NO opacity at all', {
                opacity,
                'this._htmlElement': this._htmlElement,
                this: this
            });
            return this.css({opacity: 1});
        } else if (opacity > 1) {
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
    constructor({id, text, cls}: ISubElemOptions = {}) {
        super({tag: "div", text, cls});
        if (id)
            this.id(id);
    }
}

class Span extends Elem {
    constructor({id, text, cls}: ISubElemOptions = {}) {
        super({tag: 'span', text, cls});
        if (id)
            this.id(id);
    }
}

class Img extends Elem {
    _htmlElement: HTMLImageElement;
    
    constructor({id, src, cls}: IImgOptions) {
        if (!src)
            throw new Error(`Img constructor didn't receive src`);
        super({tag: 'img', cls});
        if (id)
            this.id(id);
        this._htmlElement.src = src;
    }
}


function elem(elemOptions: IElemOptions): Elem {
    return new Elem(elemOptions);
}

function span({id, text, cls}: ISubElemOptions = {}): Span {
    return new Span({id, text, cls});
}

function div({id, text, cls}: ISubElemOptions = {}): Div {
    return new Div({id, text, cls});
}

function img({id, src, cls}: IImgOptions): Img {
    return new Img({id, src, cls});
}
