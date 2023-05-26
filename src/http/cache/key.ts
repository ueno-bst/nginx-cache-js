import {ConfigObject} from "~/lib/http/config";
import request from "~/lib/request";

export function key(r: NginxHTTPRequest) {
    return request(r, (r) => {
        const
            path = r.variables.njs_http_config ?? '',
            config = ConfigObject.load(path);

        r.variables.njs_http_debug = config.debug ? "1" : "";

        const
            loc = config.getCurrentLocation(),
            key = loc.getCacheKey();

        if (key !== "") {
            r.variables.njs_http_cache_bypass = "0";
            r.variables.njs_http_cache_nocache = "0";

            return key;
        }

        return "";
    });
}

