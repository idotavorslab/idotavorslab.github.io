const carouselRight = document.querySelector("body > main > carousel > button.right");
const carouselLeft = document.querySelector("body > main > carousel > button.left");

interface TElemOptions {
    tag: string;
    id: string;
    htmlElement: string;
    text: string
}


class Elem {
    _htmlElement: any;
    
    constructor(elemOptions: TElemOptions) {
        const {tag, id, htmlElement, text} = elemOptions;
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
    
    /**@return {HTMLElement}*/
    get e() {
        return this._htmlElement;
    }
    
    // ** Basic
    
    /**@param {string} html
     @return {Elem}*/
    html(html) {
        this._htmlElement.innerHTML = html;
        return this;
    }
    
    /**@param {string} txt
     @return {Elem}*/
    text(txt) {
        this._htmlElement.innerText = txt;
        return this;
        
    }
    
    /**@param {string} id
     @return {Elem}*/
    id(id) {
        this._htmlElement.id = id;
        return this;
    }
    
    /**@param {Object} css
     @return {Elem}*/
    css(css) {
        for (let [styleAttr, styleVal] of enumerate(css))
            this._htmlElement.style[styleAttr] = styleVal;
        return this;
    }
    
    /**@return {string[]}*/
    class() {
        return Array.from(this._htmlElement.classList);
    }
    
    
    // ** Classes
    
    /**@param {string} cls
     @param {...string} clses
     @return {Elem}*/
    addClass(cls, ...clses) {
        this._htmlElement.classList.add(cls);
        for (let c of clses)
            this._htmlElement.classList.add(c);
        return this;
    }
    
    /**@param {string} cls
     @return {Elem}*/
    removeClass(cls) {
        this._htmlElement.classList.remove(cls);
        return this;
    }
    
    /**@param {string} cls
     @return {Elem}*/
    setClass(cls) {
        this._htmlElement.className = cls;
        return this;
    }
    
    /**@param {string} cls
     @param {boolean} turnOn
     @return {Elem}*/
    toggleClass(cls, turnOn) {
        const alreadyHasCls = this._htmlElement.classList.contains(cls);
        if (turnOn && !alreadyHasCls)
            return this.addClass(cls);
        else if (!turnOn && alreadyHasCls)
            return this.removeClass(cls);
        else
            return this;
        
    }
    
    // ** Nodes
    
    /**@param {...Elem} children
     @return {Elem}*/
    append(...children) {
        for (let child of children)
            this._htmlElement.appendChild(child.e);
        return this;
    }
    
    /**@param {?string?} selector
     @return {Elem}*/
    child(selector) {
        const childrenVanilla = Array.from(this._htmlElement.children);
        if (!selector)
            return new Elem({htmlElement: childrenVanilla[0]});
        if (selector[0] == '.')
            return new Elem({htmlElement: childrenVanilla.find(c => c.classList.contains(selector.slice(1)))});
        if (selector[0] == '#')
            return new Elem({htmlElement: childrenVanilla.find(c => c.id == selector.slice(1))});
        else
            throw new Error("Not Implemented: selector must start with either a .dot or #hash");
    }
    
    /**@param {?string?} selector
     @return {Elem[]}*/
    children(selector) {
        const childrenVanilla = Array.from(this._htmlElement.children);
        const toElem = c => new Elem({htmlElement: c});
        if (!selector)
            return childrenVanilla.map(toElem);
        if (selector[0] == '.')
            return childrenVanilla.filter(c => c.class().includes(selector.slice(1))).map(toElem);
        else
            throw new Error(`Not Implemented: selector must start with a .dot. selector: ${selector}`);
    }
    
    
    // ** Events
    
    /**@param {TElemEvents} evTypeFnPairs
     @return {Elem}*/
    on(evTypeFnPairs) {
        for (let [evType, evFn] of enumerate(evTypeFnPairs))
            this._htmlElement.addEventListener(evType, evFn);
        return this;
    }
    
    /**
     @param {function} fn
     @param {{once:boolean}?} options
     @return {Elem}*/
    touchstart(fn, options) {
        this._htmlElement.addEventListener('touchstart', function _f(ev) {
            ev.preventDefault();
            fn(ev);
            if (options && options.once)
                this.removeEventListener('touchstart', _f);
        });
        return this;
    }
    
    /**
     @param {function} fn
     @param {{once:boolean}?} options
     @return {Elem}*/
    pointerdown(fn, options) {
        this._htmlElement.addEventListener('pointerdown', function _f(ev) {
            ev.preventDefault();
            fn(ev);
            if (options && options.once)
                this.removeEventListener('pointerdown', _f);
        });
        return this;
    }
    
    
    /**@param {function} fn
     @param {...*} args
     @return {Elem}*/
    click(fn, ...args) {
        this._htmlElement.addEventListener('click', fn);
        return this;
    }
    
    // ** Attributes
    
    /**@param {Object} attrValPairs
     @return {Elem}*/
    attr(attrValPairs) {
        for (let [attr, val] of enumerate(attrValPairs))
            this._htmlElement.setAttribute(attr, val);
        return this;
    }
    
    /**@param {string} qualifiedName
     * @return {Elem}*/
    removeAttribute(qualifiedName) {
        this._htmlElement.removeAttribute(qualifiedName);
        return this;
    }
    
    // ** Fade
    
    /**@param {number} dur
     @return {Elem}*/
    fadeOut(dur) {
        let opacity = float(this._htmlElement.style.opacity);
        if (opacity == undefined)
            return console.error('fadeOut htmlElement has NO opacity at all', {opacity, this: this});
        else if (opacity <= 0)
            return this;
        
        if (dur == 0)
            return this.css({opacity: 0});
        
        
        const steps = 10;
        const opDec = 1 / steps;
        const everyms = dur / steps;
        const interval = setInterval(() => {
            if (opacity > 0) {
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
    
    /**@param {number} dur
     @return {Elem}*/
    fadeIn(dur) {
        let opacity = float(this._htmlElement.style.opacity);
        if (opacity == undefined)
            return console.error('fadeIn htmlElemtn has NO opacity at all', {opacity, this: this});
        else if (opacity >= 1)
            return this;
        
        if (dur == 0)
            return this.css({opacity: 1});
        
        
        const steps = 10;
        const opInc = 1 / steps;
        const everyms = dur / steps;
        
        
        const interval = setInterval(() => {
            if (opacity < 1) {
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
    constructor({id, text} = {}) {
        super({tag: 'div', text});
        if (id)
            this.id(id);
    }
}

class Span extends Elem {
    constructor({id, text} = {}) {
        super({tag: 'span', text});
        if (id)
            this.id(id);
    }
}

class Img extends Elem {
    constructor({id, src}) {
        super({tag: 'img'});
        if (id)
            this.id(id);
        this._htmlElement.src = src;
    }
}
