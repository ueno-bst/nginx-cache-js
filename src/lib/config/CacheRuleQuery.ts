import {r} from "~/lib/request";
import CacheRule from "~/lib/config/CacheRule";


export default class CacheRuleQuery extends CacheRule {

    values(): CacheValueType {
        const
            values: CacheValueType = {},
            src = r.variables.args;

        if (src) {
            for (let query of src.split("&")) {
                const [key, value] = query.split("=", 2);

                if (!values[key]) {
                    values[key] = [];
                }

                values[key].push(value);
            }
        }

        return values;
    }
}
