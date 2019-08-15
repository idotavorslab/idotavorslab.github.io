function float(str: string): number {
    return parseFloat(str);
}

function int(x, base?: string | number | Function): number {
    return parseInt(x, <number>base);
}


class Dict<T> {
    constructor(obj: T) {
        Object.assign(this, obj);
    }
    
    * items(): IterableIterator<[string, T[keyof T]]> {
        const proxy = this as unknown as T;
        for (let k in proxy) {
            yield [k, proxy[k]];
        }
    }
    
    * keys(): IterableIterator<string> {
        const proxy = this as unknown as T;
        for (let k in proxy) {
            yield k;
        }
    }
}

function dict<T>(obj: T): Dict<T> {
    return new Dict<T>(obj);
}

class Str extends String {
    constructor(value) {
        super(value);
    }
    
    isdigit(): boolean {
        return !isNaN(int(this));
    }
    
    upper(): string {
        return this.toUpperCase();
    }
    
    lower(): string {
        return this.toLowerCase();
    }
}

// const oldProto = Str.prototype;
// Str = function (lol) {
//     console.log({'this': this, lol});
//     let zis = this;
//
//     return new Proxy(this, {
//         get(target: Str, p: string | number | symbol, receiver: any): any {
//             console.log('get');
//         }
//     });
// };
// Str.prototype = oldProto;
// Object.defineProperty(Str, 'prototype', {
//     set: function (value) {
//         console.log('set!', {value});
//     },
//     get: function () {
//         console.log('get!');
//         return true;
//     },
//
// });

function str(val) {
    return new Str(val);
}

function enumerate<T>(obj: T[]): IterableIterator<[number, T]>;
function enumerate<T>(obj: T): IterableIterator<[keyof T, T[keyof T]]>;
function* enumerate(obj) {
    if (Array.isArray(obj) || typeof obj[Symbol.iterator] === 'function') {
        let i: number = 0;
        for (let x of obj) {
            yield [i, x];
        }
    } else {
        for (let prop in obj) {
            yield [prop, obj[prop]];
        }
    }
}

function wait(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function concurrent<T>(...promises: Promise<T>[]): Promise<T[]> {
    return await Promise.all(promises);
}

type TAjax = {
    post: (url: string, data: any) => Promise<any>;
    get: (url: string) => Promise<any>;
};
const ajax: TAjax = (() => {
    function _tryResolveResponse(xhr: XMLHttpRequest, resolve, reject) {
        if (xhr.status != 200) {
            return reject(xhr);
        }
        try {
            return resolve(JSON.parse(xhr.responseText));
        } catch (e) {
            if (e instanceof SyntaxError) {
                console.warn(
                    "failed JSON parsing xhr responseText. returning raw",
                    {xhr}
                );
                return resolve(xhr.responseText);
            } else {
                console.error({xhr});
                return reject("Got bad xhr.responseText. Logged above", xhr);
            }
        }
    }
    
    function _baseRequest(
        type: "get" | "post",
        url: string,
        data?: object
    ): Promise<object> {
        // if (!url.startsWith("/")) url = "/" + url;
        const xhr = new XMLHttpRequest();
        return new Promise(async (resolve, reject) => {
            await xhr.open(str(type).upper(), url, true);
            xhr.onload = () => _tryResolveResponse(xhr, resolve, reject);
            if (type === "get") xhr.send();
            else if (type === "post") xhr.send(JSON.stringify(data));
            else
                throw new Error(
                    `util.ajax._baseRequest, receivd bad 'type': "${type}". should be either "get" or "post". url: ${url}`
                );
        });
    }
    
    function get(url: string): Promise<object> {
        return _baseRequest("get", url);
    }
    
    function post(url: string, data: any): Promise<object> {
        return _baseRequest("post", url, data);
    }
    
    return {post, get};
})();
const TL: Gsap.Tween & { toAsync: (target: object, duration: number, vars: Gsap.ToVars) => Promise<unknown> } = {
    
    ...TweenLite,
    toAsync: (target: object, duration: number, vars: Gsap.ToVars) =>
        new Promise(resolve =>
            TL.to(target, duration,
                {
                    ...vars,
                    onComplete: resolve
                })
        )
};

function round(n: number, d: number = 0) {
    const fr = 10 ** d;
    return int(n * fr) / fr;
}

async function fetchJson(path: string, cache: RequestCache) {
    let req = new Request(path, {cache});
    return (await (await fetch(req)).json());
}

function windowStats() {
    console.log(window.clientInformation.userAgent);
    return `
window.outerHeight: ${window.outerHeight}
window.innerHeight: ${window.innerHeight}
window.outerWidth: ${window.outerWidth}
window.innerWidth: ${window.innerWidth}
html.clientHeight: ${document.documentElement.clientHeight}
html.clientWidth: ${document.documentElement.clientWidth}
body.clientHeight: ${document.body.clientHeight}
body.clientWidth: ${document.body.clientWidth}
iPhone: ${isIphone}
`
}

// const setWindowStatsInnerText = () => {
//     document.getElementById('window_stats').innerText = windowStats();
// };
//
// document.addEventListener("DOMContentLoaded", setWindowStatsInnerText);
// window.onresize = setWindowStatsInnerText;

function copyToClipboard(val) {
    const copyText = elem({tag: "input"});
    // @ts-ignore
    copyText.e.value = val;
    elem({htmlElement: document.body}).append(copyText);
    // @ts-ignore
    copyText.e.select();
    document.execCommand("copy");
    copyText.remove();
}

function calcCssValue(h1, h2) {
    const x = (100 * (h1[1] - h2[1])) / (h1[0] - h2[0]);
    const y = (h1[0] * h2[1] - h2[0] * h1[1]) / (h1[0] - h2[0]);
    const isYPos = y >= 0;
    const expression = `calc(${round(x, 2)}vh ${isYPos ? '+' : '-'} ${round(Math.abs(y), 2)}px)`;
    copyToClipboard(expression);
    return expression
}

function calcAbsValue(cssStr: string, height: number) {
    const vh = cssStr.substring(cssStr.indexOf('(') + 1, cssStr.indexOf('vh'));
    const px = cssStr.substring(cssStr.lastIndexOf(' ') + 1, cssStr.lastIndexOf('px'));
    const ispositive = cssStr.includes('+');
    const format = (h) => {
        let n = h * float(vh) / 100;
        if (ispositive)
            n += float(px);
        else
            n -= float(px);
        return `${round(n, 2)}px`;
    };
    const expression = format(height);
    copyToClipboard(expression);
    return expression;
    
    
}
