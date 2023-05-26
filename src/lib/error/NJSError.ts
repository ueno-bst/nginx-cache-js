import {r} from "~/lib/request";

export default class NJSError extends Error {

    public readonly type: NJSErrorType;

    constructor(message: string, type: NJSErrorType = "error") {
        super(message);
        this.type = type;
    }

    public toString() {
        return "[" + r.variables.host + ":" + this.type + "]" + this.message;
    }
}
