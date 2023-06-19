import {r} from "~/lib/request";
import {CacheConfig} from "~/@types/http/config";
import {isArray} from "lodash-es";
import CacheExpire from "~/lib/config/CacheExpire";
import CacheRuleHeader from "~/lib/config/CacheRuleHeader";
import CacheRuleQuery from "~/lib/config/CacheRuleQuery";
import CacheRuleCookie from "~/lib/config/CacheRuleCookie";
import CacheRule from "~/lib/config/CacheRule";

export default class Cache {
    private readonly config: CacheConfig;

    constructor(config: CacheConfig) {
        this.config = config;
    }

    get enable() {
        return this.config.enable ?? true;
    }

    get expire() {
        return new CacheExpire(this.config.expire ?? {});
    }

    get method() {
        const method = this.config.method;
        return isArray(method) && method.length > 0 ? method : ['HEAD', 'GET'];
    }

    get active() {
        if (this.enable) {
            const method = r.method;

            if (this.method.indexOf(method.toUpperCase()) >= 0) {
                return true;
            }
        }

        return false;
    }

    get rule(): { [key in string]: CacheRule } {
        return {
            args: new CacheRuleQuery(this.config.rule?.args ?? {'type': 'all'}),
            header: new CacheRuleHeader(this.config.rule?.header ?? {'type': 'none'}),
            cookie: new CacheRuleCookie(this.config.rule?.cookie ?? {'type': 'none'}),
        }
    }

    getAttribute(): string {
        const
            rules = this.rule,
            values: AttributeType = {schema: r.variables.scheme ?? 'http'};

        for (let key in rules) {
            values[key] = rules[key].getAttribute().toString();
        }

        return buildAttribute(values);
    }

    getBypass(): string {
        const rules = this.rule,
            values: AttributeType = {};

        for (let key in rules) {
            values[key] = rules[key].getBypass().toString();
        }

        return buildAttribute(values);
    }
}

type AttributeType = { [key in string]: string };

function buildAttribute(values: AttributeType) {
    const keys = Object.keys(values).sort(),
        attributes = [];

    for (let key of keys) {
        const value = values[key];

        if (value !== "") {
            attributes.push(key + ":[" + value + "]");
        }
    }

    return attributes.join(";");
}
