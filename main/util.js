function float(str) {
    return parseFloat(str);
}
function int(x, base) {
    return parseInt(x, base);
}
class Str {
    constructor(value) {
        debugger;
        return new Proxy(this, {
            get(target, p, receiver) {
            }
        });
    }
}
function str(val) {
    console.log({ 'this': this, val, 'val.prototype': val.prototype });
    let _Str = new Str(val);
    debugger;
    return _Str;
}
function* enumerate(obj) {
    let entries = Object.entries(obj);
    if (Array.isArray(obj)) {
        console.log('isArray', { obj });
    }
    const typeofobj = typeof obj;
    console.log({ obj, typeofobj });
    entries.map((entry) => {
        const type = typeof entry[0];
        if (type === 'string' && str(entry[0]).isdigit())
            return entry[0] = int(entry[0]);
        else
            return entry[0];
    });
    return entries;
}
//# sourceMappingURL=util.js.map