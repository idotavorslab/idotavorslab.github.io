type TMap<T> = { [s: string]: T }
type TMap2<T, K extends keyof T> = { [s: string]: T[K] }
type TMap4<T> = { [s: string]: T[keyof T] }
type TMap3<T> = { [P in keyof T]: T[P] }
type TKeyValue<K, V> = { [S in Extract<K, string>]: V }
type TElemOptions = {
    tag?: 'span' | 'div' | 'button' | 'img' | any,
    id?: string,
    text?: string,
    htmlElement?: HTMLElement,
    query?: string,
    children?: TMap<string>,
    cls?: string
}

type TSubElemOptions = {
    id?: string,
    text?: string,
    cls?: string
};
type TImgOptions = {
    id?: string,
    src: string,
    cls?: string
};
type TElemEvents = {
    click?: EventListenerOrEventListenerObject,
    blur?: EventListenerOrEventListenerObject
}
type TEvent = keyof HTMLElementEventMap;
type TElemAttrs = {
    src?: string,
    href?: string,
}

interface TElemCssOpts {
    animation?: string,
    backgroundColor?: string,
    backgroundImage?: string,
    boxShadow?: string,
    color?: string,
    display?: string,
    filter?: string,
    fontSize?: string,
    gridColumn?: string,
    gridRow?: string,
    gridTemplateColumns?: string,
    height?: string,
    letterSpacing?: string,
    marginRight?: string,
    opacity?: number,
    zIndex?: number,
    
}

type StringOrNumber = string | number;

type TAjax = {
    post: (url: string, data: any) => Promise<any>;
    get: (url: string) => Promise<any>
}

interface INavbar extends Elem {
    home: Elem,
    research: Elem,
    people: Elem,
    publications: Elem,
    photos: Elem,
    contact: Elem,
    tau: Elem,
}
