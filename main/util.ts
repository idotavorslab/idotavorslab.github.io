function float(str: string): number {
    return parseFloat(str);
    
}


function int(x, base?: StringOrNumber | Function): number {
    return parseInt(x, <number>base)
}

class Str {
    constructor(value) {
        debugger;
        return new Proxy(this, {
            get(target: this, p: string | number | symbol, receiver: any): any {
            }
        });
    }
}

function str(val) {
    console.log({'this': this, val, 'val.prototype': val.prototype});
    let _Str = new Str(val);
    debugger;
    return _Str
}

function* enumerate(obj) {
    let entries = Object.entries(obj);
    if (Array.isArray(obj)) {
        console.log('isArray', {obj});
    }
    const typeofobj = typeof obj;
    console.log({obj, typeofobj});
    entries.map((entry) => {
        const type = typeof entry[0];
        if (type === 'string' && str(entry[0]).isdigit())
            return entry[0] = int(entry[0]);
        else
            return entry[0];
        
    });
    
    return entries;
}
