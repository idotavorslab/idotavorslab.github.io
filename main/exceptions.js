class BaseException extends Error {
    constructor(...args) {
        super(...args);
    }
}
class Exception extends BaseException {
    constructor(...args) {
        super(...args);
    }
}
class ValueError extends Exception {
    constructor(...args) {
        super(...args);
    }
}
class ArithmeticError extends Exception {
    constructor(...args) {
        super(...args);
    }
}
class ZeroDivisionError extends ArithmeticError {
    constructor(...args) {
        super(...args);
    }
}
//# sourceMappingURL=exceptions.js.map