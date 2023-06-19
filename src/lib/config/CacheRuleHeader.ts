import {r} from "~/lib/request";
import CacheRule from "~/lib/config/CacheRule";


export default class CacheRuleHeader extends CacheRule {
    values(): CacheValueType {
        const values: CacheValueType = {};

        for (let key in r.headersIn) {
            if (key !== 'Cookie') {
                values[key] = [r.headersIn[key]];
            }
        }

        return values;
    }

    sanitize(key: string): string {
        return key
            .split(/[\-_]/)
            .map(v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase())
            .join("-");
    }
}
