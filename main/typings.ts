export interface IElemOptions {
    tag?: ('span' | 'div' | 'button' | 'img'),
    id?: string,
    text?: string,
    htmlElement?: HTMLElement,
    query?: string
}

export interface IElemCssOpts {
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

export type StringOrNumber = string | number;
