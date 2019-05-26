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
function* foo(bar) {
    for (const b of bar)
        yield b;
}
foo(["hi", "bye"]);
const logger = new Logger({ name: "gilad", age: 27 });
