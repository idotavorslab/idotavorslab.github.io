declare function float(str: string): number;
declare function int(x: any, base?: StringOrNumber | Function): number;
declare type ExK<T> = Extract<keyof T, string>;
declare class Dict<T> {
    constructor(obj: T);
    items(): IterableIterator<[ExK<T>, T[ExK<T>]]>;
}
declare function dict<T>(obj: T): Dict<T>;
declare class Str extends String {
    constructor(value: any);
    isdigit(): boolean;
    upper(): string;
    lower(): string;
}
declare function str(val: any): Str;
declare function enumerate<T>(o: T): T extends any[] ? IterableIterator<[number, T]> : IterableIterator<[keyof T, T[keyof T]]>;
declare function wait(ms: number): Promise<any>;
declare function concurrent<T>(...promises: Promise<T>[]): Promise<T[]>;
declare const ajax: TAjax;
