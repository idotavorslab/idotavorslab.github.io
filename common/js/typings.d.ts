declare type TEvent = keyof HTMLElementEventMap;
declare type TEventFunctionMap<K> = {
    [P in Extract<K, string>]?: (evt: Event) => void;
};
declare type TMap<T> = {
    [s: string]: T;
};
declare type TMap2<T, K extends keyof T> = {
    [s: string]: T[K];
};
declare type TMap4<T> = {
    [s: string]: T[keyof T];
};
declare type TMap3<T> = {
    [P in keyof T]: T[P];
};
declare type TKeyValue<K, V> = {
    [S in Extract<K, string>]: V;
};
declare type TElemOptions = {
    tag?: 'span' | 'div' | 'button' | 'img' | any;
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
    src: string;
    cls?: string;
};
declare type TElemAttrs = {
    src?: string;
    href?: string;
};
interface TElemCssOpts {
    animation?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    boxShadow?: string;
    color?: string;
    display?: string;
    filter?: string;
    fontSize?: string;
    gridColumn?: string;
    gridRow?: string;
    gridTemplateColumns?: string;
    height?: string;
    letterSpacing?: string;
    marginRight?: string;
    opacity?: number;
    zIndex?: number;
}
declare type StringOrNumber = string | number;
declare type TAjax = {
    post: (url: string, data: any) => Promise<any>;
    get: (url: string) => Promise<any>;
};
interface INavbar extends Elem {
    home: Elem;
    research: Elem;
    people: Elem;
    publications: Elem;
    photos: Elem;
    contact: Elem;
    tau: Elem;
}
