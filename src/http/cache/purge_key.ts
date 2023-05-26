import {ConfigObject} from "~/lib/http/config";
import request from "~/lib/request";

export function purge_key(r: NginxHTTPRequest) {
    return request(r, (r) => {
        const
            path = r.variables.njs_http_config ?? '',
            config = ConfigObject.load(path);

        const
            purge_key = config.getCachePurgeKey();

        if (purge_key) {
            r.variables.njs_http_cache_purge_key = purge_key;
            return purge_key;
        }

        return "";
    });
}


