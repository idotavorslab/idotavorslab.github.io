function float(str) {
    return parseFloat(str);
}
function int(x, base) {
    return parseInt(x, base);
}
class Dict {
    constructor(obj) {
        Object.assign(this, obj);
    }
    *items() {
        const proxy = this;
        for (let k in proxy) {
            yield [k, proxy[k]];
        }
    }
    *keys() {
        const proxy = this;
        for (let k in proxy) {
            yield k;
        }
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
function* enumerate(obj) {
    if (Array.isArray(obj)) {
        let i = 0;
        for (let x of obj) {
            yield [i, x];
        }
    }
    else {
        for (let prop in obj) {
            yield [prop, obj[prop]];
        }
    }
}
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
const TL = Object.assign({}, window.TweenLite, { toAsync: (target, duration, vars) => new Promise(resolve => TL.to(target, duration, Object.assign({}, vars, { onComplete: resolve }))) });
function round(n, d = 0) {
    const fr = 10 ** d;
    return int(n * fr) / fr;
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
    const copyText = elem({ tag: "input" });
    copyText.e.value = val;
    elem({ htmlElement: document.body }).append(copyText);
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
    return expression;
}
function calcAbsValue(cssStr, height) {
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
//# sourceMappingURL=util.js.map