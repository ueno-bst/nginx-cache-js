import {r} from "~/lib/request";
import CacheRule from "~/lib/config/CacheRule";


export default class CacheRuleCookie extends CacheRule {
    values(): CacheValueType {
        const
            values: CacheValueType = {},
            src = r.headersIn.Cookie;

        if (src) {
            const data = src.split(/\s*;\s*/);

            for (let datum of data) {
                const [key, value] = datum.split('=', 2);

                values[key] = [value];
            }
        }

        return values;
    }
}
