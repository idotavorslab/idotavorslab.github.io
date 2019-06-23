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
    items() {
        return Object.entries(this);
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
            i++;
        }
    }
    else {
        for (let k in obj) {
            yield [k, obj[k]];
        }
    }
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
                console.warn('failed JSON parsing xhr responseText. returning raw', { xhr });
                return resolve(xhr.responseText);
            }
            else {
                console.error({ xhr });
                return reject("Got bad xhr.responseText. Logged above", xhr);
            }
        }
    }
    function _baseRequest(type, url, data) {
        if (!url.startsWith('/'))
            url = "/" + url;
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
    function get(url) {
        return _baseRequest('get', url);
    }
    function post(url, data) {
        return _baseRequest('post', url, data);
    }
    return { post, get };
})();
//# sourceMappingURL=util.js.map