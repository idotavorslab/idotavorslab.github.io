function float(str: string): number {
    return parseFloat(str);
    
}


function int(x, base?: StringOrNumber | Function): number {
    return parseInt(x, <number>base)
}

class Str extends String {
    
    constructor(value) {
        super(value);
        
    }
    
    isdigit(): boolean {
        return !isNaN(int(this));
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
