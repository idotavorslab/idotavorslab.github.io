const carouselRight = document.querySelector("body > main > carousel > button.right");
const carouselLeft = document.querySelector("body > main > carousel > button.left");

interface TElemOptions {
    tag?: ('span' | 'div' | 'button' | 'img'),
    id?: string,
    text?: string,
    htmlElement?: HTMLElement,
    query?: string
}


class Elem {
    _htmlElement: HTMLElement;
    
    constructor(elemOptions: TElemOptions) {
        const {tag, id, htmlElement, text, query} = elemOptions;
        
        if ([tag, id, htmlElement, query].filter(x => x).length > 1)
            throw new Error(`only tag or id or htmlElement or query, not more than one, elemOptions: ${elemOptions.keys()},Object.values(elemOptions): ${Object.values(elemOptions)}`);
        if (tag)
            this._htmlElement = document.createElement(tag);
        else if (id)
            this._htmlElement = document.getElementById(id);
        else if (query)
            this._htmlElement = document.querySelector(query);
        else if (htmlElement)
            this._htmlElement = htmlElement;
        else
            throw new Error(`exactly one must be given: tag or id or htmlElement or query, elemOptions.keys(): ${elemOptions.keys()}, Object.values(elemOptions): ${Object.values(elemOptions)}`);
        
        if (text != undefined)
            this.text(text);
        
        
    }
    
    get e(): HTMLElement {
        return this._htmlElement;
    }
    
    // ** Basic
    
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
    
    // ** Classes
    
    
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
        const alreadyHasCls = this._htmlElement.classList.contains(cls);
        if (turnOn && !alreadyHasCls)
            return this.addClass(cls);
        else if (!turnOn && alreadyHasCls)
            return this.removeClass(cls);
        else
            return this;
        
    }
    
    // ** Nodes
    append(...children: Elem[]): Elem {
        for (let child of children)
            this._htmlElement.appendChild(child.e);
        return this;
    }
    
    child(selector?: string): Elem {
        // @ts-ignore
        const childrenVanilla: HTMLElement[] = Array.from(this._htmlElement.children);
        if (!selector)
            return new Elem({htmlElement: childrenVanilla[0]});
        if (selector[0] == '.')
            return new Elem({htmlElement: childrenVanilla.find(c => c.classList.contains(selector.slice(1)))});
        if (selector[0] == '#')
            return new Elem({htmlElement: childrenVanilla.find(c => c.id == selector.slice(1))});
        else
            throw new Error("Not Implemented: selector must start with either a .dot or #hash");
    }
    
    children(): Elem[] {
        // @ts-ignore
        const childrenVanilla: HTMLElement[] = Array.from(this._htmlElement.children);
        const toElem = (c: HTMLElement) => new Elem({htmlElement: c});
        /*if (!selector)
            return childrenVanilla.map(toElem);
        if (selector[0] == '.')
            return childrenVanilla.filter(c => c.class().includes(selector.slice(1))).map(toElem);
        else
            throw new Error(`Not Implemented: selector must start with a .dot. selector: ${selector}`);
        */
        return childrenVanilla.map(toElem);
    }
    
    
    // ** Events
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
    
    // ** Attributes
    
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
    
    // ** Fade
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
    constructor({id, text}: ISubElemOpts = {}) {
        super({tag: "div", text});
        if (id)
            this.id(id);
    }
}

class Span extends Elem {
    constructor({id, text}: ISubElemOpts = {}) {
        super({tag: 'span', text});
        if (id)
            this.id(id);
    }
}


class Img extends Elem {
    _htmlElement: HTMLImageElement;
    
    constructor({id, src}: IImgElemOpts) {
        super({tag: 'img'});
        if (id)
            this.id(id);
        this._htmlElement.src = src;
    }
}

const isIphone = window.clientInformation.userAgent.includes('iPhone');
