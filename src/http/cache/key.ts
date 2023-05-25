import {ConfigObject} from "../../lib/http/config";

export function cache_key(r: NginxHTTPRequest) {
    const config = ConfigObject.load("/etc/nginx/config.json");

    if (config) {
        const
            loc = config.getCurrentLocation(r),
            key = loc.getCacheKey(r);

        if (key) {
            return key;
        }
    }

    return "";
}

