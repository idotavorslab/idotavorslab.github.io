interface IElemOptions {
    tag?: ('span' | 'div' | 'button' | 'img'),
    id?: string,
    text?: string,
    htmlElement?: HTMLElement,
    query?: string
}

interface IElemCssOpts {
    animation?: string,
    backgroundColor?: string,
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
