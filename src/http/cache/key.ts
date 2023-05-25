import {ConfigObject} from "~/lib/http/config";

export function key(r: NginxHTTPRequest) {
    const config = ConfigObject.load("/etc/nginx/config.json");

    if (config) {
        r.variables.njs_http_debug = config.debug ? "1" : "";

        const
            loc = config.getCurrentLocation(r),
            key = loc.getCacheKey(r);

        if (key !== "") {
            r.variables.njs_http_cache_bypass = "0";
            r.variables.njs_http_cache_nocache = "0";

            return key;
        }
    }

    return "";
}

