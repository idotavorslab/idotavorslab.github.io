const $BP0 = 1535;
const $BP1 = 1340;
const $BP4 = 500;
const W0 = 1200;
const W1 = 984;
const GOOGLEBLUE = '#3b82f0';
let MOBILE = undefined;
function float(str) {
    return parseFloat(str);
}
function int(x, base) {
    return parseInt(x, base);
}
function bool(val) {
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
class Dict {
    constructor(obj) {
        Object.assign(this, obj);
    }
    items() {
        const proxy = this;
        const kvpairs = [];
        for (let k in proxy) {
            kvpairs.push([k, proxy[k]]);
        }
        return kvpairs;
    }
    keys() {
        const proxy = this;
        const keys = [];
        for (let k in proxy) {
            keys.push(k);
        }
        return keys;
    }
    values() {
        const proxy = this;
        const values = [];
        for (let k in proxy) {
            values.push(proxy[k]);
        }
        return values;
    }
}
function dict(obj) {
    return new Dict(obj);
}
class Str extends String {
    constructor(value) {
        super(value);
    }
    isdigit() {
        return !isNaN(int(this));
    }
    upper() {
        return this.toUpperCase();
    }
    lower() {
        return this.toLowerCase();
    }
}
function str(val) {
    return new Str(val);
}
async function concurrent(...promises) {
    return await Promise.all(promises);
}
const ajax = (() => {
    function _tryResolveResponse(xhr, resolve, reject) {
        if (xhr.status != 200) {
            return reject(xhr);
        }
        try {
            return resolve(JSON.parse(xhr.responseText));
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                console.warn("failed JSON parsing xhr responseText. returning raw", { xhr });
                return resolve(xhr.responseText);
            }
            else {
                console.error({ xhr });
                return reject("Got bad xhr.responseText. Logged above", xhr);
            }
        }
    }
    function _baseRequest(type, url, data) {
        const xhr = new XMLHttpRequest();
        return new Promise(async (resolve, reject) => {
            await xhr.open(str(type).upper(), url, true);
            xhr.onload = () => _tryResolveResponse(xhr, resolve, reject);
            if (type === "get")
                xhr.send();
            else if (type === "post")
                xhr.send(JSON.stringify(data));
            else
                throw new Error(`util.ajax._baseRequest, receivd bad 'type': "${type}". should be either "get" or "post". url: ${url}`);
        });
    }
    function get(url) {
        return _baseRequest("get", url);
    }
    function post(url, data) {
        return _baseRequest("post", url, data);
    }
    return { post, get };
})();
const TL = Object.assign({}, TweenLite, { toAsync: (target, duration, vars) => new Promise(resolve => TL.to(target, duration, Object.assign({}, vars, { onComplete: resolve }))) });
function round(n, d = 0) {
    const fr = 10 ** d;
    return int(n * fr) / fr;
}
async function _fetch(path, cache = "default", fmt) {
    let req = new Request(path, { cache });
    return (await fetch(req))[fmt]();
}
async function fetchArray(path, cache = "default") {
    let fetched = await _fetch(path, cache, "json");
    return fetched;
}
async function fetchDict(path, cache = "default") {
    let fetched = await _fetch(path, cache, "json");
    return dict(fetched);
}
async function fetchText(path, cache = "default") {
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
`;
}
function copyToClipboard(val) {
    const copyText = elem({ tag: 'input' });
    copyText.e.value = val;
    elem({ htmlElement: document.body }).append(copyText);
    copyText.e.select();
    document.execCommand("copy");
    copyText.remove();
}
function calcCssValue(h1, h2) {
    const x = (100 * (h1[1] - h2[1])) / (h1[0] - h2[0]);
    const y = (h1[0] * h2[1] - h2[0] * h1[1]) / (h1[0] - h2[0]);
    const isYPositive = y >= 0;
    const expression = `calc(${round(x, 2)}vw ${isYPositive ? '+' : '-'} ${round(Math.abs(y), 2)}px)`;
    copyToClipboard(expression);
    return expression;
}
function calcAbsValue(cssStr, width) {
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
function less(val) {
    return [`%c${val}`, 'font-size: 10px; color: rgb(150,150,150)'];
}
function log(bold = false) {
    return function _log(target, name, descriptor, ...outargs) {
        const orig = descriptor.value;
        descriptor.value = function (...args) {
            console.log(`%c${name}`, `color: #ffc66d${bold ? '; font-weight: bold' : ''}`);
            return orig.apply(this, args);
        };
    };
}
function isinstance(obj, ...ctors) {
    for (let ctor of ctors)
        if (obj instanceof ctor)
            return true;
    return false;
}
JSON.parstr = (value) => {
    function nodeToObj(node) {
        const domObj = {};
        for (let prop in node) {
            let val = node[prop];
            if (bool(val)) {
                if (isinstance(val, HTMLCollection, Window, NamedNodeMap, NodeList))
                    continue;
                domObj[prop] = val;
            }
        }
        return Object.assign({ localName: node.localName }, domObj);
    }
    let stringified = JSON.stringify(value, (thisArg, key) => {
        if (key instanceof Node) {
            return nodeToObj(key);
        }
        else if (key instanceof BetterHTMLElement) {
            key.type = key.__proto__.constructor.name;
            return key;
        }
        else {
            return key;
        }
    });
    let parsed = JSON.parse(stringified);
    return parsed;
};
function showArrowOnHover(anchors) {
    anchors.forEach((anch) => {
        anch
            .mouseover(() => anch.addClass('arrow'))
            .mouseout(async () => {
            anch.replaceClass('arrow', 'arrow-trans');
            await wait(200);
            anch.removeClass('arrow-trans');
        });
    });
}
//# sourceMappingURL=util.js.map