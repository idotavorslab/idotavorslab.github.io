interface IElemOptions {
    tag?: 'span' | 'div' | 'button' | 'img' | any,
    id?: string,
    text?: string,
    htmlElement?: HTMLElement,
    query?: string,
    children?: Object,
    cls?:string
}

type ISubElemOptions = {
    id?: string,
    text?: string,
    cls?: string
};

interface IElemCssOpts {
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
    letterSpacing?: string,
    marginRight?: string,
    opacity?: number,
    zIndex?: number,
    
}

type StringOrNumber = string | number;

interface IAjax {
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
