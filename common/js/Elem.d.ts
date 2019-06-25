declare class Elem {
    _htmlElement: HTMLElement;
    constructor(elemOptions: TElemOptions);
    readonly e: HTMLElement;
    html(html: string): this;
    text(txt: string): this;
    id(id: string): this;
    css(css: TElemCssOpts): this;
    class(): string[];
    remove(): this;
    addClass(cls: string, ...clses: string[]): this;
    removeClass(cls: string): this;
    replaceClass(oldToken: string, newToken: string): this;
    setClass(cls: string): this;
    toggleClass(cls: string, turnOn: boolean): this;
    append(...children: this[]): this;
    cacheAppend(keyChildObj: TMap<this>): this;
    child(selector: string): Elem;
    replaceChild(newChild: this, oldChild: this): this;
    children(): Elem[];
    cacheChildren(keySelectorObj: TMap<string>): void;
    empty(): this;
    on(evTypeFnPairs: TTElemEvent<"abort">): this;
    touchstart(fn: (ev: Event) => any, options?: {
        once: boolean;
    }): this;
    pointerdown(fn: (event: Event) => any, options?: {
        once: boolean;
    } | null): this;
    click(fn: any, ...args: any[]): this;
    attr(attrValPairs: TElemAttrs): this;
    removeAttribute(qualifiedName: string): this;
    data(key: string, parse?: boolean): any;
    fadeOut(dur: number): this;
    fadeIn(dur: number): this;
}
declare class Div extends Elem {
    _htmlElement: HTMLDivElement;
    constructor({ id, text, cls }?: TSubElemOptions);
}
declare class Span extends Elem {
    _htmlElement: HTMLSpanElement;
    constructor({ id, text, cls }?: TSubElemOptions);
}
declare class Img extends Elem {
    _htmlElement: HTMLImageElement;
    constructor({ id, src, cls }: TImgOptions);
}
declare function elem(elemOptions: TElemOptions): Elem;
declare function span({ id, text, cls }: TSubElemOptions): Span;
declare function div({ id, text, cls }: TSubElemOptions): Div;
declare function img({ id, src, cls }: TImgOptions): Img;
