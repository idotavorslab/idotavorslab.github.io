class Logger {
    constructor(options) {
        const { name, age } = options;
        this._name = name;
        this._age = age;
        console.log(Object.assign({}, options, { msg: "hey" }));
    }
    get name() {
        return this._name;
    }
    set name(val) {
        this._name = val;
    }
    get age() {
        return this._age;
    }
    set age(val) {
        this._age = val;
    }
}
const logger = new Logger({ name: "gilad", age: 27 });
console.log('hello');
