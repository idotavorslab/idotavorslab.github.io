type TEvent = keyof HTMLElementEventMap;
type TEventFunctionMap<K> = {
    [P in Extract<K, string>]?: (evt: Event) => void
};


type ElemOptions = {
    tag?: "span" | "div" | "button" | "img" | any;
    id?: string;
    text?: string;
    htmlElement?: HTMLElement;
    query?: string;
    children?: TMap<string>;
    cls?: string;
};

type TSubElemOptions = {
    id?: string;
    text?: string;
    cls?: string;
};
type TImgOptions = {
    id?: string;
    src?: string;
    cls?: string;
};

type TElemAttrs = {
    src?: string;
    href?: string;
};

interface CssOptions {
    alignContentS?: string;
    alignItems?: string;
    alignSelf?: string;
    alignmentBaseline?: string;
    animation?: string;
    animationDelay?: string;
    animationDirection?: AnimationDirection;
    animationDuration?: string;
    animationFillMode?: AnimationFillMode;
    animationIterationCount?: number;
    animationName?: string;
    animationPlayState?: AnimationPlayState;
    animationTimingFunction?: AnimationTimingFunction;
    backfaceVisibility?: string;
    background?: string;
    backgroundAttachment?: string;
    backgroundClip?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundOrigin?: string;
    backgroundPosition?: string;
    backgroundPositionX?: string;
    backgroundPositionY?: string;
    backgroundRepeat?: string;
    backgroundSize?: string;
    baselineShift?: string;
    border?: string;
    borderBottom?: string;
    borderBottomColor?: string;
    borderBottomLeftRadius?: string;
    borderBottomRightRadius?: string;
    borderBottomStyle?: string;
    borderBottomWidth?: string;
    borderCollapse?: string;
    borderColor?: string;
    borderImage?: string;
    borderImageOutset?: string;
    borderImageRepeat?: string;
    borderImageSlice?: string;
    borderImageSource?: string;
    borderImageWidth?: string;
    borderLeft?: string;
    borderLeftColor?: string;
    borderLeftStyle?: string;
    borderLeftWidth?: string;
    borderRadius?: string;
    borderRight?: string;
    borderRightColor?: string;
    borderRightStyle?: string;
    borderRightWidth?: string;
    borderSpacing?: string;
    borderStyle?: string;
    borderTop?: string;
    borderTopColor?: string;
    borderTopLeftRadius?: string;
    borderTopRightRadius?: string;
    borderTopStyle?: string;
    borderTopWidth?: string;
    borderWidth?: string;
    bottom?: string;
    boxShadow?: string;
    boxSizing?: string;
    breakAfter?: string;
    breakBefore?: string;
    breakInside?: string;
    captionSide?: string;
    clear?: string;
    clip?: string;
    clipPath?: string;
    clipRule?: string;
    color?: string;
    colorInterpolationFilters?: string;
    columnCount?: any;
    columnFill?: string;
    columnGap?: any;
    columnRule?: string;
    columnRuleColor?: any;
    columnRuleStyle?: string;
    columnRuleWidth?: any;
    columnSpan?: string;
    columnWidth?: any;
    columns?: string;
    content?: string;
    counterIncrement?: string;
    counterReset?: string;
    cssFloat?: string;
    cssText?: string;
    cursor?: string;
    direction?: string;
    display?: string;
    dominantBaseline?: string;
    emptyCells?: string;
    enableBackground?: string;
    fill?: string;
    fillOpacity?: string;
    fillRule?: string;
    filter?: string;
    flex?: string;
    flexBasis?: string;
    flexDirection?: string;
    flexFlow?: string;
    flexGrow?: string;
    flexShrink?: string;
    flexWrap?: string;
    floodColor?: string;
    floodOpacity?: string;
    font?: string;
    fontFamily?: string;
    fontFeatureSettings?: string;
    fontSize?: string;
    fontSizeAdjust?: string;
    fontStretch?: string;
    fontStyle?: string;
    fontVariant?: string;
    fontWeight?: string;
    gap?: string;
    glyphOrientationHorizontal?: string;
    glyphOrientationVertical?: string;
    grid?: string;
    gridArea?: string;
    gridAutoColumns?: string;
    gridAutoFlow?: string;
    gridAutoRows?: string;
    gridColumn?: string;
    gridColumnEnd?: string;
    gridColumnGap?: string;
    gridColumnStart?: string;
    gridGap?: string;
    gridRow?: string;
    gridRowEnd?: string;
    gridRowGap?: string;
    gridRowStart?: string;
    gridTemplate?: string;
    gridTemplateAreas?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    height?: string;
    imeMode?: string;
    justifyContent?: string;
    justifyItems?: string;
    justifySelf?: string;
    kerning?: string;
    layoutGrid?: string;
    layoutGridChar?: string;
    layoutGridLine?: string;
    layoutGridMode?: string;
    layoutGridType?: string;
    left?: string;
    readonly length?: number;
    letterSpacing?: string;
    lightingColor?: string;
    lineBreak?: string;
    lineHeight?: string;
    listStyle?: string;
    listStyleImage?: string;
    listStylePosition?: string;
    listStyleType?: string;
    margin?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    marginTop?: string;
    marker?: string;
    markerEnd?: string;
    markerMid?: string;
    markerStart?: string;
    mask?: string;
    maskImage?: string;
    maxHeight?: string;
    maxWidth?: string;
    minHeight?: string;
    minWidth?: string;
    msContentZoomChaining?: string;
    msContentZoomLimit?: string;
    msContentZoomLimitMax?: any;
    msContentZoomLimitMin?: any;
    msContentZoomSnap?: string;
    msContentZoomSnapPoints?: string;
    msContentZoomSnapType?: string;
    msContentZooming?: string;
    msFlowFrom?: string;
    msFlowInto?: string;
    msFontFeatureSettings?: string;
    msGridColumn?: any;
    msGridColumnAlign?: string;
    msGridColumnSpan?: any;
    msGridColumns?: string;
    msGridRow?: any;
    msGridRowAlign?: string;
    msGridRowSpan?: any;
    msGridRows?: string;
    msHighContrastAdjust?: string;
    msHyphenateLimitChars?: string;
    msHyphenateLimitLines?: any;
    msHyphenateLimitZone?: any;
    msHyphens?: string;
    msImeAlign?: string;
    msOverflowStyle?: string;
    msScrollChaining?: string;
    msScrollLimit?: string;
    msScrollLimitXMax?: any;
    msScrollLimitXMin?: any;
    msScrollLimitYMax?: any;
    msScrollLimitYMin?: any;
    msScrollRails?: string;
    msScrollSnapPointsX?: string;
    msScrollSnapPointsY?: string;
    msScrollSnapType?: string;
    msScrollSnapX?: string;
    msScrollSnapY?: string;
    msScrollTranslation?: string;
    msTextCombineHorizontal?: string;
    msTextSizeAdjust?: any;
    msTouchAction?: string;
    msTouchSelect?: string;
    msUserSelect?: string;
    msWrapFlow?: string;
    msWrapMargin?: any;
    msWrapThrough?: string;
    objectFit?: string;
    objectPosition?: string;
    opacity?: string | number;
    order?: string;
    orphans?: string;
    outline?: string;
    outlineColor?: string;
    outlineOffset?: string;
    outlineStyle?: string;
    outlineWidth?: string;
    overflow?: string;
    overflowX?: string;
    overflowY?: string;
    padding?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    paddingTop?: string;
    pageBreakAfter?: string;
    pageBreakBefore?: string;
    pageBreakInside?: string;
    readonly parentRule?: CSSRule;
    penAction?: string;
    perspective?: string;
    perspectiveOrigin?: string;
    pointerEvents?: string;
    position?: string;
    quotes?: string;
    resize?: string;
    right?: string;
    rotate?: string;
    rowGap?: string;
    rubyAlign?: string;
    rubyOverhang?: string;
    rubyPosition?: string;
    scale?: string;
    scrollBehavior?: string;
    stopColor?: string;
    stopOpacity?: string;
    stroke?: string;
    strokeDasharray?: string;
    strokeDashoffset?: string;
    strokeLinecap?: string;
    strokeLinejoin?: string;
    strokeMiterlimit?: string;
    strokeOpacity?: string;
    strokeWidth?: string;
    tableLayout?: string;
    textAlign?: string;
    textAlignLast?: string;
    textAnchor?: string;
    textCombineUpright?: string;
    textDecoration?: string;
    textIndent?: string;
    textJustify?: string;
    textKashida?: string;
    textKashidaSpace?: string;
    textOverflow?: string;
    textShadow?: string;
    textTransform?: string;
    textUnderlinePosition?: string;
    top?: string;
    touchAction?: string;
    transform?: string;
    transformOrigin?: string;
    transformStyle?: string;
    transition?: string;
    transitionDelay?: string;
    transitionDuration?: string;
    transitionProperty?: string;
    transitionTimingFunction?: string;
    translate?: string;
    unicodeBidi?: string;
    userSelect?: string;
    verticalAlign?: string;
    visibility?: string;
    
    webkitColumnBreakAfter?: string;
    webkitColumnBreakBefore?: string;
    webkitColumnBreakInside?: string;
    webkitColumnCount?: any;
    webkitColumnGap?: any;
    webkitColumnRule?: string;
    webkitColumnRuleColor?: any;
    webkitColumnRuleStyle?: string;
    webkitColumnRuleWidth?: any;
    webkitColumnSpan?: string;
    webkitColumnWidth?: any;
    webkitColumns?: string;
    
    webkitUserModify?: string;
    webkitUserSelect?: string;
    webkitWritingMode?: string;
    whiteSpace?: string;
    widows?: string;
    width?: string;
    wordBreak?: string;
    wordSpacing?: string;
    wordWrap?: string;
    writingMode?: string;
    zIndex?: string;
    zoom?: string;
    
    
}

type CubicBezierFunction = [number, number, number, number];
type Jumpterm = 'jump-start' | 'jump-end' | 'jump-none' | 'jump-both' | 'start' | 'end';

/**Displays an animation iteration along n stops along the transition, displaying each stop for equal lengths of time.
 * For example, if n is 5,  there are 5 steps.
 * Whether the animation holds temporarily at 0%, 20%, 40%, 60% and 80%, on the 20%, 40%, 60%, 80% and 100%, or makes 5 stops between the 0% and 100% along the animation, or makes 5 stops including the 0% and 100% marks (on the 0%, 25%, 50%, 75%, and 100%) depends on which of the following jump terms is used*/
type StepsFunction = [number, Jumpterm];
type AnimationTimingFunction =
    'linear'
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'step-start'
    | 'step-end'
    | StepsFunction
    | CubicBezierFunction
type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';


interface AnimateOptions {
    delay?: string;
    direction?: AnimationDirection;
    duration: string;
    fillMode?: AnimationFillMode;
    iterationCount?: number;
    name: string;
    playState?: AnimationPlayState;
    /** Also accepts:
     * cubic-bezier(p1, p2, p3, p4)
     * 'ease' == 'cubic-bezier(0.25, 0.1, 0.25, 1.0)'
     * 'linear' == 'cubic-bezier(0.0, 0.0, 1.0, 1.0)'
     * 'ease-in' == 'cubic-bezier(0.42, 0, 1.0, 1.0)'
     * 'ease-out' == 'cubic-bezier(0, 0, 0.58, 1.0)'
     * 'ease-in-out' == 'cubic-bezier(0.42, 0, 0.58, 1.0)'
     * */
    timingFunction?: AnimationTimingFunction;
}

class Elem {
    _htmlElement: HTMLElement;
    
    
    constructor(elemOptions: ElemOptions) {
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
    
    css(css: CssOptions): this {
        for (let [styleAttr, styleVal] of dict(css).items())
            this.e.style[<string>styleAttr] = styleVal;
        return this;
    }
    
    animate(opts: AnimateOptions) {
        // ordered
        const optionals = [opts.timingFunction, opts.delay, opts.iterationCount, opts.direction, opts.fillMode, opts.playState];
        // filter out undefined, whitespace separate. mandatories first.
        const animation = `${opts.name} ${opts.duration} ${optionals.filter(v => v).join(' ')}`;
        // reset so can run animation again
        this.on({animationend: () => this.css({animation: null})});
        this.css({animation})
    }
    
    // **  Classes
    class(): string[] {
        return Array.from(this.e.classList);
    }
    
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
    
    remove(): this {
        this.e.remove();
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


function elem(elemOptions: ElemOptions): Elem {
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
