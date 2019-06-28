type TMap<T> = { [s: string]: T };


type StringOrNumber = string | number;

type TAjax = {
    post: (url: string, data: any) => Promise<any>;
    get: (url: string) => Promise<any>;
};
