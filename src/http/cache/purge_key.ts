import {ConfigObject} from "~/lib/http/config";

export function purge_key(r: NginxHTTPRequest) {
    const config = ConfigObject.load("/etc/nginx/config.json");

    if (config) {
        const
            purge_key = config.getCachePurgeKey(r);

        if (purge_key) {
            return purge_key;
        }
    }

    return "";
}


