/*import {StringOrNumber} from "./typings";
import {ValueError} from "./exceptions";
*/

function float(str: string): number {
    return parseFloat(str);
    
}

class Int extends Number {
    
    
    /*divide(y: Int | number) {
        
        if (y == 0) {
            throw new ZeroDivisionError("division by zero")
        } else {
            return this / y;
        }
    }
    */
    
    
    constructor(x, base?: StringOrNumber | Function) {
        
        
        const typeofx = typeof x;
        if (base === undefined) {
            base = 10;
        } else {
            // base was passed explicitly
            if (typeofx === 'number') {
                throw new TypeError(`int() can't convert non-string with explicit base`)
            }
        }
        const typeofbase = typeof base;
        if (base === null)
            throw new TypeError(`'null' object cannot be interpreted as an integer`);
        if ((base < 2 || base > 36) && base != 0)
            throw new ValueError("int() base must be >= 2 and <= 36, or 0");
        
        if (typeofx !== 'number' && typeofx !== 'string')
            throw new TypeError(`int() argument must be a string, a bytes-like object or a number, not '${typeofx}'`);
        if (!RegExp(/\d/).test(x))
            throw new ValueError(`invalid literal for int() with base ${base}: '${x}'`);
        
        const mod = x % 1;
        if (isNaN(mod))
            throw new ValueError(`invalid literal for int() with base ${base}: '${x}'`);
        if (typeofx === 'string') {
            for (let c of x) {
                if (c >= base && c != '0') {
                    throw new ValueError(`invalid literal for int() with base ${base}: '${x}'`);
                }
            }
        }
        
        if (mod != 0)
            if (x < 0)
                super(Math.ceil(x));
            else
                super(Math.floor(x));
        else if (base != 10)
            super(parseInt(x, <number>base));
        else
            super(x);
    }
    
    
}

function int(x, base?: StringOrNumber | Function): Int {
    return new Int(x, base)
}

class Str {
    _val: any;
    
    constructor(val) {
        this._val = val;
    }
    
    valueOf() {
        return this._val;
    }
    
    isdigit() {
        return !isNaN(int(this));
    }
}

function str(val) {
    return new Str(val)
}

function* enumerate(obj) {
    let entries = Object.entries(obj);
    if (Array.isArray(obj)) {
    
    }
    const typeofobj = typeof obj;
    
    entries.map((entry) => {
        const type = typeof entry[0];
        if (type === 'string' && str(entry[0]).isdigit())
            return entry[0] = int(entry[0]);
        else
            return entry[0];
        
    });
    
    return entries;
}
