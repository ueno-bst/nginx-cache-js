import {ConfigObject} from "../../lib/http/config";

export function cache_key(r: NginxHTTPRequest) {
    ConfigObject.load("/etc/nginx/config.json");
    return "aaa";
}

