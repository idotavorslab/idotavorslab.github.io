declare type TEvent = keyof HTMLElementEventMap;
declare type TEventFunctionMap<K> = {
    [P in Extract<K, string>]?: (evt: Event) => void;
};
declare type ElemOptions = {
    tag?: "span" | "div" | "button" | "img" | any;
    id?: string;
    text?: string;
    htmlElement?: HTMLElement;
    query?: string;
    children?: TMap<string>;
    cls?: string;
};
declare type TSubElemOptions = {
    id?: string;
    text?: string;
    cls?: string;
};
declare type TImgOptions = {
    id?: string;
    src?: string;
    cls?: string;
};
declare type TElemAttrs = {
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
    preload?: "auto" | string;
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
    width?: string | number;
    wordBreak?: string;
    wordSpacing?: string;
    wordWrap?: string;
    writingMode?: string;
    zIndex?: string;
    zoom?: string;
}

declare type CubicBezierFunction = [number, number, number, number];
declare type Jumpterm = 'jump-start' | 'jump-end' | 'jump-none' | 'jump-both' | 'start' | 'end';
/**Displays an animation iteration along n stops along the transition, displaying each stop for equal lengths of time.
 * For example, if n is 5,  there are 5 steps.
 * Whether the animation holds temporarily at 0%, 20%, 40%, 60% and 80%, on the 20%, 40%, 60%, 80% and 100%, or makes 5 stops between the 0% and 100% along the animation, or makes 5 stops including the 0% and 100% marks (on the 0%, 25%, 50%, 75%, and 100%) depends on which of the following jump terms is used*/
declare type StepsFunction = [number, Jumpterm];
declare type AnimationTimingFunction =
    'linear'
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'step-start'
    | 'step-end'
    | StepsFunction
    | CubicBezierFunction;
declare type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
declare type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';

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

declare class BetterHTMLElement {
    _htmlElement: HTMLElement;
    
    constructor(elemOptions: ElemOptions);
    
    readonly e: HTMLElement;
    
    html(html: string): this;
    
    text(txt: string): this;
    
    id(id: string): this;
    
    css(css: CssOptions): this;
    
    uncss(...removeProps: (keyof CssOptions)[]): this;
    
    class(cls: string): this;
    class(): string[];
    
    addClass(cls: string, ...clses: string[]): this;
    
    removeClass(cls: string): this;
    
    replaceClass(oldToken: string, newToken: string): this;
    
    toggleClass(cls: string, force?: boolean): this;
    
    append(...nodes: BetterHTMLElement[] | (string | Node)[]): this;
    
    cacheAppend(keyChildObj: TMap<BetterHTMLElement>): this;
    
    child<K extends keyof HTMLElementTagNameMap>(selector: K): this;
    child<K extends keyof SVGElementTagNameMap>(selector: K): this;
    child(selector: string): BetterHTMLElement;
    
    replaceChild(newChild: Node, oldChild: Node): this;
    replaceChild(newChild: BetterHTMLElement, oldChild: BetterHTMLElement): this;
    
    children(): BetterHTMLElement[];
    
    cacheChildren(keySelectorObj: TMap<string>): void;
    
    empty(): this;
    
    remove(): this;
    
    on(evTypeFnPairs: TEventFunctionMap<TEvent>, options?: AddEventListenerOptions): this;
    
    touchstart(fn: (ev: Event) => any, options?: AddEventListenerOptions): this;
    
    pointerdown(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    
    click(): this;
    click(fn: (event: Event) => any, options?: AddEventListenerOptions): this;
    
    attr(attrValPairs: TElemAttrs): this;
    
    removeAttribute(qualifiedName: string): this;
    
    data(key: string, parse?: boolean): any;
    
    fade(dur: number, to: 0 | 1): Promise<this>;
    
    fadeOut(dur: number): Promise<this>;
    
    fadeIn(dur: number): Promise<this>;
}

declare class Div extends BetterHTMLElement {
    _htmlElement: HTMLDivElement;
    
    constructor({id, text, cls}?: TSubElemOptions);
}

declare class Span extends BetterHTMLElement {
    _htmlElement: HTMLSpanElement;
    
    constructor({id, text, cls}?: TSubElemOptions);
}

declare class Img extends BetterHTMLElement {
    _htmlElement: HTMLImageElement;
    
    constructor({id, src, cls}: TImgOptions);
}

declare function elem(elemOptions: ElemOptions): BetterHTMLElement;

declare function span({id, text, cls}: TSubElemOptions): Span;

declare function div({id, text, cls}: TSubElemOptions): Div;

declare function img({id, src, cls}: TImgOptions): Img;

declare type TMap<T> = {
    [s: string]: T;
};

declare function enumerate<T>(obj: T[]): IterableIterator<[number, T]>;
declare function enumerate<T>(obj: T): IterableIterator<[keyof T, T[keyof T]]>;

declare function wait(ms: number): Promise<any>;
