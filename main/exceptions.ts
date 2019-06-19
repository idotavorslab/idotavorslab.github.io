/**Common base class for all exceptions*/
export class BaseException extends Error {
    constructor(...args) {
        super(...args)
    }
}

/**Common base class for all non-exit exceptions.*/
export class Exception extends BaseException {
    constructor(...args) {
        super(...args)
    }
}

/**Inappropriate argument value (of correct type).*/
export class ValueError extends Exception {
    constructor(...args) {
        super(...args)
    }
}

/**Base class for arithmetic errors.*/
export class ArithmeticError extends Exception {
    constructor(...args) {
        super(...args)
    }
}

/**Second argument to a division or modulo operation was zero*/
export class ZeroDivisionError extends ArithmeticError {
    constructor(...args) {
        super(...args)
    }
}
