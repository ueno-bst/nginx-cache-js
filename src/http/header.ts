import {isUndefined} from "lodash-es";
import toBoolean from "~/lib/helper/toBoolean";

function output(r: NginxHTTPRequest) {
    if (toBoolean(r.variables.ngc_debug)) {
        r.headersOut['X-Server-Location'] = r.variables.ngc_location;

        r.headersOut['X-Cache-Key'] = r.variables.ngc_cache_key_raw;
        r.headersOut['X-Cache-Purge-Key'] = r.variables.ngc_cache_pure_key_raw;

        r.headersOut['X-Cache-Bypass'] = r.variables.ngc_cache_bypass;
        r.headersOut['X-Cache-NoCache'] = r.variables.ngc_cache_nocache;

        r.headersOut['X-Cache-Expire-Min'] = r.variables.ngc_cache_min_expire;
        r.headersOut['X-Cache-Expire-Default'] = r.variables.ngc_cache_default_expire;
        r.headersOut['X-Cache-Expire-Max'] = r.variables.ngc_cache_max_expire;
    }

    age(r);

    return;
}

/**
 * Ageヘッダの出力処理
 */
function age(r: NginxHTTPRequest) {
    const
        upstream_http_date = r.variables.upstream_http_date,
        http_date = r.headersOut['Date'],
        date = isUndefined(upstream_http_date) ? http_date : upstream_http_date

    if (!isUndefined(date)) {
        const
            diff = Math.floor((Date.now() - Date.parse(date)) / 1E3);

        if (diff > 0) {
            r.headersOut['Age'] = diff + "";
        }
    }
}

export default {output};
