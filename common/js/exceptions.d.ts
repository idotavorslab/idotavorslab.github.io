declare class BaseException extends Error {
    constructor(...args: any[]);
}
declare class Exception extends BaseException {
    constructor(...args: any[]);
}
declare class ValueError extends Exception {
    constructor(...args: any[]);
}
declare class ArithmeticError extends Exception {
    constructor(...args: any[]);
}
declare class ZeroDivisionError extends ArithmeticError {
    constructor(...args: any[]);
}
