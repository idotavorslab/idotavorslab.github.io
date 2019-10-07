const $BP0 = 1535;
// needs to be higher than --W0
const $BP1 = 1340;
// needs to be higher than --W1
const $BP4 = 500;
// [BP1]W0[BP0]
const W0 = 1200;
// [BP2]W1[BP1]
const W1 = 984;

const GOOGLEBLUE = '#3b82f0';

let MOBILE = undefined;

async function untilNotUndefined(val: any, debugText?: string): Promise<boolean> {
    let count: number = 0;
    while (val === undefined) {
        if (count >= 500) {
            console.warn(`untilNotUndefined(val) reached count 500, returning false. debugText: ${debugText}`, {val});
            return false;
        }
        await wait(2);
        count++;
    }
    return true;
}


function float(str: string): number {
    return parseFloat(str);
}

function int(x, base?: string | number | Function): number {
    return parseInt(x, <number>base);
}

function bool(val: any): boolean {
    if (val === null)
        return false;
    const typeofval = typeof val;
    if (typeofval !== 'object') {
        if (typeofval === 'function')
            return true;
        else
            return !!val;
    }
    return Object.keys(val).length !== 0;
}


type TDict<T> = Dict<T> & { [P in keyof T]: T[P] };


// type TDict<T> =
//      Dict<T> & { [P in keyof T]: T[P] }
// const Dict

class Dict<T> {
    
    constructor(obj: T) {
        Object.assign(this, obj);
    }
    
    items(): [string, T[keyof T]][] {
        const proxy = this as unknown as T;
        const kvpairs = [];
        for (let k in proxy) {
            kvpairs.push([k, proxy[k]]);
        }
        return kvpairs;
    }
    
    keys(): string[] {
        const proxy = this as unknown as T;
        const keys = [];
        for (let k in proxy) {
            keys.push(k);
        }
        return keys;
    }
    
    values(): string[] {
        const proxy = this as unknown as T;
        const values = [];
        for (let k in proxy) {
            values.push(proxy[k]);
        }
        return values;
    }
    
    
}

function dict<T>(obj: T): TDict<T> {
    return new Dict<T>(obj) as TDict<T>;
}


/*class List<T> extends Array {
    constructor(items: T[]) {
        super(...items);
    }
    
    count(object: T): number {
        return this.filter(x => x === object).length
    }
    
    index(object: T, start?: number, stop?: number): number {
        if (stop === undefined)
            return super.indexOf(object, start);
        else // assumes start and stop arent undefined
            return this.slice(start, stop).indexOf(object)
    }
    
    // sort({key, reverse}: { key?: (k: T) => any, reverse?: boolean } = {key: k => k, reverse: false}) {
    //     // return super.sort()
    // }
    
}

function list<T>(items: T[]) {
    return new List<T>(items);
}*/

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

function str(val) {
    return new Str(val);
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

async function _fetch(path: string, cache: RequestCache, fmt: "json")
async function _fetch(path: string, cache: RequestCache, fmt: "text")
async function _fetch(path, cache: RequestCache = "default", fmt) {
    let req = new Request(path, {cache});
    return (await fetch(req))[fmt]();
}


async function fetchArray(path: string, cache?: RequestCache): Promise<any[]>
async function fetchArray<T>(path: string, cache?: RequestCache): Promise<T[]>
async function fetchArray(path, cache = "default") {
    let fetched = await _fetch(path, <RequestCache>cache, "json");
    return fetched;
}

async function fetchDict(path: string, cache?: RequestCache): Promise<TDict<any>>
async function fetchDict<T>(path: string, cache?: RequestCache): Promise<TDict<T>>
async function fetchDict(path, cache = "default") {
    let fetched = await _fetch(path, <RequestCache>cache, "json");
    return dict(fetched);
}

async function fetchText(path: string, cache: RequestCache = "default"): Promise<string> {
    return _fetch(path, cache, "text");
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
    const copyText = elem({tag: 'input'});
    // @ts-ignore
    copyText.e.value = val;
    elem({htmlElement: document.body}).append(copyText);
    // @ts-ignore
    copyText.e.select();
    document.execCommand("copy");
    copyText.remove();
}

/**@example
 * calcCssValue([1138, 286], [1040, 260])
 * > "calc(26.53vw - 15.91px)"*/
function calcCssValue(h1: [number, number], h2: [number, number]) {
    const x = (100 * (h1[1] - h2[1])) / (h1[0] - h2[0]);
    const y = (h1[0] * h2[1] - h2[0] * h1[1]) / (h1[0] - h2[0]);
    const isYPositive = y >= 0;
    const expression = `calc(${round(x, 2)}vw ${isYPositive ? '+' : '-'} ${round(Math.abs(y), 2)}px)`;
    copyToClipboard(expression);
    return expression
}

/**@example
 * calcAbsValue("calc(26.53vh - 15.91px)", 1040)
 * > "260px"*/
function calcAbsValue(cssStr: string, width: number): string {
    const vh = cssStr.substring(cssStr.indexOf('(') + 1, cssStr.indexOf('vh'));
    const px = cssStr.substring(cssStr.lastIndexOf(' ') + 1, cssStr.lastIndexOf('px'));
    const ispositive = cssStr.includes('+');
    const format = (w) => {
        let n = w * float(vh) / 100;
        if (ispositive)
            n += float(px);
        else
            n -= float(px);
        return `${round(n, 2)}px`;
    };
    const expression = format(width);
    copyToClipboard(expression);
    return expression;
    
    
}

function less(val: string): [string, string] {
    return [`%c${val}`, 'font-size: 10px; color: rgb(150,150,150)']
}

function log(bold: boolean = false) {
    return function _log(target, name, descriptor, ...outargs) {
        /*console.log(
            'OUTSIDE',
            '\nthis:', this, // window
            '\ntarget:', target, // class Person
            '\nname:', name,
            // '\ndescriptor:', JSON.parse(JSON.stringify(descriptor)),
            '\ndescriptor:', descriptor,
            // '\ndescriptor.value:', descriptor.value,
            '\noutargs:', outargs,
            '\narguments:', arguments,
        );
        */
        
        
        const orig = descriptor.value;
        descriptor.value = function (...args) {
            /*console.log(
                'INSIDE',
                '\nthis:', this,
                '\nargs:', args,
                '\ntarget:', target,
                '\nname:', name,
                '\ndescriptor:', JSON.parse(JSON.stringify(descriptor)),
                '\ndescriptor.value:', descriptor.value,
                '\norig:', orig
            );
            */
            console.log(`%c${name}`, `color: #ffc66d${bold ? '; font-weight: bold' : ''}`);
            return orig.apply(this, args);
        };
        // return descriptor;
        
    }
}

function isinstance(obj, ...ctors) {
    for (let ctor of ctors)
        if (obj instanceof ctor)
            return true;
    return false;
}

JSON.parstr = (value: any) => {
    function nodeToObj(node: Node) {
        const domObj = {};
        for (let prop in node) {
            let val = node[prop];
            if (bool(val)) {
                if (isinstance(val, HTMLCollection, Window, NamedNodeMap, NodeList))
                    continue;
                domObj[prop] = val;
            }
        }
        return {localName: node.localName, ...domObj};
        // let tmp = {};
        // tmp[node.localName] = domObj;
        // return tmp;
    }
    
    let stringified = JSON.stringify(value, (thisArg, key) => {
        if (key instanceof Node) {
            // thisArg = `${thisArg} (${key.localName})`;
            return nodeToObj(key);
        } else if (key instanceof BetterHTMLElement) {
            key.type = key.__proto__.constructor.name;
            return key;
        } else {
            return key;
        }
    });
    let parsed = JSON.parse(stringified);
    // if (!Array.isArray(parsed) && typeof parsed === 'object') {
    //     let parsedNew = {};
    //     for (let key in parsed) {
    //         parsedNew[key] = {...{localName: value[key].localName}, ...parsed[key]};
    //     }
    //     return parsedNew;
    // }
    return parsed;
    
    
};

function showArrowOnHover(anchors: BetterHTMLElement[]) {
    anchors.forEach((anch: BetterHTMLElement) => {
        anch
            .mouseover(() => anch.addClass('arrow'))
            .mouseout(async () => {
                anch.replaceClass('arrow', 'arrow-trans');
                // *  DEP: index.sass a:after transition
                await wait(200);
                anch.removeClass('arrow-trans');
            })
    });
}


interface JSON {
    
    parstr:
    /**JSON.parse(JSON.stringify(value))*/
        (value: any) => any,
}


