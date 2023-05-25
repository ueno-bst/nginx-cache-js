import {ConfigObject} from "../../lib/http/config";

export function cache_purge_key(r: NginxHTTPRequest) {
    const config = ConfigObject.load("/etc/nginx/config.json");

    if (config) {
        const
            uri_var =  r.variables['njs_http_cache_purge_uri'],
            uri = uri_var && uri_var !== "" ? uri_var : r.uri,
            purge_key = config.getCachePurgeKey(r);

        if (purge_key) {
            return purge_key;
        }
    }

    return "";
}


