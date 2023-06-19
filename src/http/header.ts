import {isUndefined} from "lodash-es";
import toBoolean from "~/lib/helper/toBoolean";

function output(r: NginxHTTPRequest) {
    if (toBoolean(r.variables.njs_http_debug)) {
        r.headersOut['X-Server-Location'] = r.variables.njs_http_location;
        r.headersOut['X-Cache-Key'] = r.variables.njs_http_cache_key_raw;
        r.headersOut['X-Cache-Ages'] = r.variables.njs_http_cache_ages;
        r.headersOut['X-Cache-Purge-Key'] = r.variables.njs_http_cache_purge_key;
        r.headersOut['X-Cache-Bypass'] = r.variables.njs_http_cache_bypass;
        r.headersOut['X-Cache-NoCache'] = r.variables.njs_http_cache_nocache;
    }

    age(r);

    return;
}

/**
 * Ageヘッダの出力処理
 */
function age(r: NginxHTTPRequest) {
    const upstream_http_date = r.variables.upstream_http_date;

    if (!isUndefined(upstream_http_date)) {
        const
            diff = Math.floor((Date.now() - Date.parse(upstream_http_date)) / 1E3);

        if (diff > 0) {
            r.headersOut['Age'] = diff + "";
        }
    }
}

export default {output};
