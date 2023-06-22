import request from "~/lib/request";
import {Server} from "~/lib/config/Server";

export function key(r: NginxHTTPRequest) {
    return request(r, (r) => {
        const
            path = r.variables.ngc_config ?? '',
            config = Server.load(path);

        r.variables.ngc_debug = config.debug ? "1" : "";

        return config.getCacheKey();
    });
}

