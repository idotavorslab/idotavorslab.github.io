function float(str: string): number {
    return parseFloat(str);
    
}


function int(x, base?: StringOrNumber | Function): number {
    return parseInt(x, <number>base)
}

class Dict<T> {
    constructor(obj: T) {
        Object.assign(this, obj);
    }
    
    items(): [keyof T, T[keyof T]][] {
        return <Array<[keyof T, T[keyof T]]>>Object.entries(this);
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
        return this.toLowerCase()
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

function keys<T>(obj: TMap<T> | T[]): string[] {
    return Object.keys(obj);
}

function entries<T>(obj: TMap<T> | T[]): [string, T][] {
    return Object.entries(obj);
}

function values<T>(obj: TMap<T> | T[]): T[] {
    return Object.values(obj);
}

keys([1, 2, 3]);
entries([1, 2, 3]);
values([1, 2, 3]);


function enumerate<T>(o: T): T extends any[] ? IterableIterator<[number, T]> : IterableIterator<[keyof T, T[keyof T]]> // GOOD (equiv)
function* enumerate(obj) {
    if (Array.isArray(obj)) {
        let i = 0;
        for (let x of obj) {
            yield [i, x];
            i++
        }
    } else {
        for (let k in obj) {
            yield [k, obj[k]]
        }
    }
    
}


const ajax: TAjax = (() => {
    
    
    function _tryResolveResponse(xhr: XMLHttpRequest, resolve, reject) {
        if (xhr.status != 200) {
            return reject(xhr);
        }
        try {
            return resolve(JSON.parse(xhr.responseText));
        } catch (e) {
            if (e instanceof SyntaxError) {
                console.warn('failed JSON parsing xhr responseText. returning raw', {xhr});
                return resolve(xhr.responseText);
            } else {
                console.error({xhr});
                return reject("Got bad xhr.responseText. Logged above", xhr);
            }
        }
    }
    
    
    function _baseRequest(type: 'get' | 'post', url: string, data?: object): Promise<object> {
        if (!url.startsWith('/')) url = "/" + url;
        const xhr = new XMLHttpRequest();
        return new Promise(async (resolve, reject) => {
            await xhr.open(str(type).upper(), url, true);
            xhr.onload = () => _tryResolveResponse(xhr, resolve, reject);
            if (type === 'get')
                xhr.send();
            else if (type === 'post')
                xhr.send(JSON.stringify(data));
            else
                throw new Error(`util.ajax._baseRequest, receivd bad 'type': "${type}". should be either "get" or "post". url: ${url}`);
        });
    }
    
    function get(url: string): Promise<object> {
        return _baseRequest('get', url);
    }
    
    function post(url: string, data: any): Promise<object> {
        return _baseRequest('post', url, data);
    }
    
    return {post, get};
})();
