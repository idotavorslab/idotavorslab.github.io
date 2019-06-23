function float(str) {
    return parseFloat(str);
}
function int(x, base) {
    return parseInt(x, base);
}
class Str extends String {
    constructor(value) {
        super(value);
    }
    isdigit() {
        return !isNaN(int(this));
    }
}
function str(val) {
    return new Str(val);
}
function* enumerate(obj) {
    if (Array.isArray(obj)) {
        let i = 0;
        for (let x of obj) {
            yield [i, x];
            i++;
        }
    }
    else {
        for (let k in obj) {
            yield [k, obj[k]];
        }
    }
}
//# sourceMappingURL=util.js.map