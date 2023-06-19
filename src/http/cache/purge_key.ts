import request from "~/lib/request";
import {Server} from "~/lib/config/Server";

export function purge_key(r: NginxHTTPRequest) {
    return request(r, (r) => {
        const
            path = r.variables.njs_http_config ?? '',
            config = Server.load(path);

        return config.getCachePurgeKey();
    });
}


