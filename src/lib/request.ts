import NJSError from "~/lib/error/NJSError";

class RequestObject {
    get r(): NginxHTTPRequest {
        return this._req as NginxHTTPRequest;
    }
    private _req?: NginxHTTPRequest;

    constructor() {
    }

    set(req:NginxHTTPRequest) {
        this._req = req;
    }
}

const
    request = new RequestObject();

let r: NginxHTTPRequest;

export {r};

export default <T>(req: NginxHTTPRequest, cb: (req: NginxHTTPRequest) => T): T | undefined => {
    r = req;

    try {
        return cb(req);
    } catch (e) {
        if (e instanceof NJSError) {
            const message = e.toString();

            switch(e.type) {
                case "error":
                    req.error(message);
                    break;
                case "log":
                    req.log(message);
                    break;
                case "warn":
                    req.warn(message);
                    break;
            }
        } else {
            req.error(e + "");
        }

        throw e;
    }
}
