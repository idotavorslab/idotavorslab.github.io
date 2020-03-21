// needs to be greater than --W0
const $BP1 = 1340;

// needs to be greater than --W1
const $BP2 = 1025;

// needs to be greater than --W2
const $BP3 = 760;


// [BP1]W0[BP0]
const W0 = 1200;

// [BP2]W1[BP1]
const W1 = 984;

const GOOGLEBLUE = '#3b82f0';

let MOBILE = undefined;
// let SHOW_STATS = false;
const FILEDATA = {};
const ALWAYS_LOWERCASE = ["a",
    "an",
    "the",
    "at",
    "by",
    "for",
    "in",
    "of",
    "on",
    "to",
    "up",
    "and",
    "as",
    "but",
    "or",
    "nor"];
const capitalizeWord = w => `${w.slice(0, 1).toUpperCase()}${w.slice(1)}`;
const capitalizeLine = line => line.split(' ').map(word => ALWAYS_LOWERCASE.includes(word) ? word : capitalizeWord(word)).join(' ');

function float(str: string): number {
    return parseFloat(str);
}

function int(x, base?: string | number | Function): number {
    return parseInt(x, <number>base);
}

function bool(val: any): boolean {
    if (val === null) {
        return false;
    }
    const typeofval = typeof val;
    if (typeofval !== 'object') {
        if (typeofval === 'function') {
            return true;
        } else {
            return !!val;
        }
    }
    return Object.keys(val).length !== 0;
}


type TDict<T> = Dict<T> & { [P in keyof T]: T[P] };


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


/*

// @ts-ignore
const TL: ITL = {
    
    /!*...TweenLite || function () {
        this.load()
    },*!/
    toAsync: (target: object, duration: number, vars: Gsap.ToVars) =>
        new Promise(resolve =>
            TL.to(target, duration,
                {
                    ...vars,
                    onComplete: resolve
                })
        ),
    isLoaded: false,
    async load() {
        console.log('TL.load(), this:', this);
        if (TL.isLoaded)
            return true;
        let script = document.querySelector(`script[src*="Tween"]`);
        let count = 0;
        while (script === null) {
            if (count >= 2000) {
                if (count === 2000)
                    console.trace(`TL.loaded() count: ${count}. Waiting 200ms, warning every 1s.`);
                else if (count % 5 === 0)
                    console.warn(`TL.loaded() count: ${count}. Waiting 200ms, warning every 1s.`);
                await wait(200);
            } else {
                await wait(5);
            }
            script = document.querySelector(`script[src*="Tween"]`);
            count++;
        }
        console.log(...green('TweenLite script loaded'));
        TL.isLoaded = true;
        return true;
    },
    
    /!*load: async () => {
        
        if (TL.isLoaded)
            return true;
        let script = document.querySelector(`script[src*="Tween"]`);
        let count = 0;
        while (script === null) {
            if (count >= 2000) {
                if (count === 2000)
                    console.trace(`TL.loaded() count: ${count}. Waiting 200ms, warning every 1s.`);
                else if (count % 5 === 0)
                    console.warn(`TL.loaded() count: ${count}. Waiting 200ms, warning every 1s.`);
                await wait(200);
            } else {
                await wait(5);
            }
            script = document.querySelector(`script[src*="Tween"]`);
            count++;
        }
        console.log(...green('TweenLite script loaded, this:'), this);
        TL.isLoaded = true;
        return true;
    }*!/
};*/
interface ITL extends Gsap.Tween {
    toAsync(target: object, duration: number, vars: Gsap.ToVars): Promise<unknown>;

    load(): Promise<boolean>;

    isLoaded: boolean;
}

class ExTweenLite {
    isLoaded: boolean = false;

    constructor() {
        this.load().then(() => {
            Object.assign(this, TweenLite);
        })

    }

    async toAsync(target: object, duration: number, vars: Gsap.ToVars) {
        return new Promise(resolve =>
            // @ts-ignore
            this.to(target, duration,
                {
                    ...vars,
                    onComplete: resolve
                })
        )
    }

    async load() {
        if (this.isLoaded) {
            return true;
        }
        let scriptA = document.querySelector(`script[src*="Tween"]`);
        let scriptB = document.querySelector(`script[src*="CSSPlugin"]`);
        let count = 0;

        let ms = Math.random() * 10;
        while (ms < 5) {
            ms = Math.random() * 10;
        }

        while (scriptA === null || scriptB === null) {
            if (count >= 2000) {
                if (count === 2000) {
                    console.trace(`ExTweenLite.loaded() count: ${count}. Waiting 200ms, warning every 1s.`);
                } else {
                    if (count % 5 === 0) {
                        console.warn(`ExTweenLite.loaded() count: ${count}. Waiting 200ms, warning every 1s.`);
                    }
                }
                await wait(200);
            } else {
                await wait(ms);
            }
            scriptA = document.querySelector(`script[src*="Tween"]`);
            scriptB = document.querySelector(`script[src*="CSSPlugin"]`);
            count++;
        }
        this.isLoaded = true;
        return true;
    }
}

const TL: ITL = <ITL>new ExTweenLite();

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
    let breakpoint: string;
    if (innerWidth < $BP3) {
        breakpoint = `[0] XXX [$BP3 ${$BP3}px] --- [$BP2] --- [$BP1] --- [∞]`;
    } else {
        if (innerWidth < $BP2) {
            breakpoint = `[0] --- [$BP3] XXX [$BP2 ${$BP2}px] --- [$BP1] --- [∞]`;
        } else {
            if (innerWidth < $BP1) {
                breakpoint = `[0] --- [$BP3] --- [$BP2] XXX [$BP1 ${$BP1}px] --- [∞]`;
            } else {
                breakpoint = `[0] --- [$BP3] --- [$BP2] --- [$BP1] XXX [∞]`;
            }
        }
    }
    return `
. . . . . . height. width
outer. . . .${outerHeight}. . ${outerWidth}
inner. . . .${innerHeight}. . .${outerHeight}
html.client.${document.documentElement.clientHeight}. . .${document.documentElement.clientWidth}
body.client.${document.body.clientHeight}. . .${document.body.clientWidth}
iPhone: ${IS_IPHONE} | Safari: ${IS_SAFARI}
Breakpoint: ${breakpoint}
`.split('\n')
        .filter(line => line)
        .map(line => `<div>${line}</div>`)
        .join('')
}


function isOverflown({clientWidth, clientHeight, scrollWidth, scrollHeight}): boolean {
    // console.log({clientHeight, scrollHeight});
    return scrollHeight > clientHeight || scrollWidth > clientWidth;
}

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

/**
 * pair == [dim, val] == "at this $dim px, css value of $val px looks good"
 * @example
 * calcCssValue([1138, 286], [1040, 260])
 * > "calc(26.53vw - 15.91px)"*/
function calcCssValue(dimValuePair1: [number, number], dimValuePair2: [number, number]) {
    const [dim1, val1] = dimValuePair1;
    const [dim2, val2] = dimValuePair2;
    const dim_diff = dim1 - dim2;
    const x = (100 * (val1 - val2)) / (dim_diff);
    const y = (dim1 * val2 - dim2 * val1) / (dim_diff);
    const isYPositive = y >= 0;
    const expression = `calc(${round(x, 2)}v[w | h] ${isYPositive ? '+' : '-'} ${round(Math.abs(y), 2)}px)`;
    copyToClipboard(expression);
    return expression
}

/**@example
 * calcAbsValue("calc(26.53vh - 15.91px)", 1040)
 * > "260px"*/
function calcAbsValue(cssStr: string, dim: number): string {
    let unit = cssStr.includes('vh') ? 'vh' : cssStr.includes('vw') ? 'vw' : '%';
    const amount = cssStr.substring(cssStr.indexOf('(') + 1, cssStr.indexOf(unit));
    const px = cssStr.substring(cssStr.lastIndexOf(' ') + 1, cssStr.lastIndexOf('px'));
    const ispositive = cssStr.includes('+');
    const format = (w) => {
        let n = w * float(amount) / 100;
        if (ispositive) {
            n += float(px);
        } else {
            n -= float(px);
        }
        console.log({amount, px, dim, unit, n});
        return `${round(n, 2)}px`;
    };
    const expression = format(dim);
    copyToClipboard(expression);
    return expression;


}

function less(val: string): [string, string] {
    return [`%c${val}`, 'font-size: 10px; color: rgb(150,150,150)']
}

function green(val: string): [string, string] {
    return [`%c${val}`, 'color: #3BAA57']
}

function orange(val: string): [string, string] {
    return [`%c${val}`, 'color: #ffc66d']
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
    for (let ctor of ctors) {
        if (obj instanceof ctor) {
            return true;
        }
    }
    return false;
}

JSON.parstr = (value: any) => {
    function nodeToObj(node: Node) {
        const domObj = {};
        for (let prop in node) {
            let val = node[prop];
            if (bool(val)) {
                if (isinstance(val, HTMLCollection, Window, NamedNodeMap, NodeList)) {
                    continue;
                }
                domObj[prop] = val;
            }
        }
        // @ts-ignore
        return {localName: node.localName, ...domObj};

    }

    let stringified = JSON.stringify(value, (__thisArg, __key) => {
        if (__key instanceof Node) {
            // __thisArg = `${__thisArg} (${__key.localName})`;
            return nodeToObj(__key);
        } else if (__key instanceof BetterHTMLElement) {
            // @ts-ignore
            __key.type = __key.__proto__.constructor.name;
            return __key;
        } else {
            return __key;
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


// child extends sup
function extend(sup, child) {
    if (bool(sup.prototype)) {
        child.prototype = sup.prototype;
    } else {
        if (bool(sup.__proto__)) {
            child.prototype = sup.__proto__;
        } else {
            child.prototype = sup;
            console.warn('Both bool(sup.prototype) and bool(sup.__proto__) failed => child.prototype is set to sup.');
        }
    }

    const handler = {
        construct
    };

    // "new BoyCls"
    function construct(_, argArray) {
        const obj = new child;
        sup.apply(obj, argArray);    // calls PersonCtor. Sets name
        child.apply(obj, argArray); // calls BoyCtor. Sets age
        return obj;
    }


    const proxy = new Proxy(child, handler);
    return proxy;
}

/*function getStackTrace(caller?) {
    const obj = {};
    Error.captureStackTrace(obj, caller ? caller : getStackTrace);
    // Error.captureStackTrace(obj, window);
    return obj.stack;
}
*/

function getStackTrace() {

    let stack;

    try {
        throw new Error('');
    } catch (error) {
        stack = error.stack || '';
    }

    stack = stack.split('\n').map(line => line.trim().replace('at ', ''));
    return stack[3]
}

async function exlog(message, ...args) {
    const colors = {
        t: '#64FFDA',
        grn: '#4CAF50',
        lg: '#76FF03',
        l: '#CDDC39',
        y: '#FFFF00',
        a: '#FFCA28',
        o: '#FF6D00',
        do: '#D84315',
        b: '#795548',
        gry: '#9e9e9e',
        bg: '#607d8b'
    };
    const stack: string = getStackTrace();
    let splitstack = stack.split(window.location.href)[1].split(':');
    let jspath = splitstack[0];

    let jsdata: string[];
    if (jspath in FILEDATA) {
        jsdata = FILEDATA[jspath];
    } else {
        let _blob = await fetch(new Request(jspath));
        jsdata = (await _blob.text()).split('\n');
        FILEDATA[jspath] = jsdata;
    }
    let jslineno = parseInt(splitstack[1]) - 1;
    if (jslineno === -1) {
        throw new Error('jslineno is -1');
    }
    let jsline = jsdata[jslineno].trim();
    let tspath = jspath.split(".")[0] + '.ts';
    // console.log({jspath, tspath});
    let tsdata: string[];
    if (tspath in FILEDATA) {
        tsdata = FILEDATA[tspath];
    } else {
        let _blob = await fetch(new Request(tspath));
        tsdata = (await _blob.text()).split('\n');
        FILEDATA[tspath] = tsdata;
    }
    const weakTsLineNos = [];
    const strongTsLineNos = [];
    tsdata.forEach((line, index) => {
        if (line.includes(jsline)) {
            strongTsLineNos.push(index);
        } else {
            if (line.split(' ').join('').includes(jsline.split(' ').join(''))) {
                weakTsLineNos.push(index);
            }
        }
    });

    let tslineno;
    if (strongTsLineNos.length < 2) {
        if (strongTsLineNos.length === 1) {
            if (weakTsLineNos.length === 0) {
                tslineno = strongTsLineNos[0];
            } else { // weakTsLineNos.length >= 1
                debugger;
            }
        } else { // strongTsLineNos.length === 0
            if (weakTsLineNos.length === 0) {
                debugger;
            } else if (weakTsLineNos.length === 1) {
                tslineno = weakTsLineNos[0];
            } else { // weakTsLineNos.length >= 2
                const weakTsLineNosScores = {};
                for (let weak of weakTsLineNos) {
                    weakTsLineNosScores[weak] = undefined;
                    for (let dist = 0; dist < 10; dist++) {
                        if (tsdata[weak + dist].includes(message)
                            || tsdata[weak - dist].includes(message)) {
                            weakTsLineNosScores[weak] = dist;
                            dist = 10;
                        }
                    }
                }
                Object.keys(weakTsLineNosScores).forEach(k => {
                    if (weakTsLineNosScores[k] === undefined) {
                        delete weakTsLineNosScores[k]
                    }

                });
                let minLineScoreTuple = [null, null];
                for (let [lineno, score] of dict(weakTsLineNosScores).items()) {
                    if (minLineScoreTuple[0] === null
                        || score < minLineScoreTuple[1]) {
                        minLineScoreTuple = [lineno, score];
                    }
                }
                tslineno = minLineScoreTuple[0];
                debugger;
            }
        }
    } else {
        debugger;
    }

    if (args[args.length - 1] in colors) {
        console.log(`%c${message}`, `color: ${colors[args[args.length - 1]]}`, ...args.slice(0, args.length - 1), `${tspath}:${tslineno + 1}`);
    } else {
        console.log(message, ...args, `${tspath}:${tslineno + 1}`);
    }
    /*    fetch(new Request(jspath)).then(async jsblob => {
            let jsdata: string[] = (await jsblob.text()).split('\n');
            let jslineno = parseInt(splitstack[1]) - 1;
            if (jslineno === -1) throw new Error('jslineno is -1');
            let jsline = jsdata[jslineno].trim();
            let tspath = jspath.split(".")[0] + '.ts';
            // console.log({tspath});
            fetch(new Request(tspath)).then(async tsblob => {
                let tsdata: string[] = (await tsblob.text()).split('\n');
                const weakTsLineNos = [];
                const strongTsLineNos = [];
                tsdata.forEach((line, index) => {
                    if (line.includes(jsline))
                        strongTsLineNos.push(index);
                    else if (line.split(' ').join('').includes(jsline.split(' ').join('')))
                        weakTsLineNos.push(index);
                });
                
                let tslineno;
                if (strongTsLineNos.length === 1) {
                    if (weakTsLineNos.length === 0)
                        tslineno = strongTsLineNos[0];
                    else {
                        debugger;
                    }
                } else {
                    if (weakTsLineNos.length === 1)
                        tslineno = weakTsLineNos[0];
                    else {
                        
                        debugger;
                    }
                }
                
                let tsline = tsdata[tslineno];
                // console.log({tsdata, tslineno, tsline});
                console.log(message, ...args, `${window.location.href}${tspath}:${tslineno + 1}`);
            });
        })
    */


}



