import {CacheConfig} from "~/lib/http/config/CacheConfig";
import {CacheValue} from "~/lib/http/config/CacheValue";

export abstract class CacheRuleConfig implements HTTP.Config.CacheRuleNode {
    private context: CacheConfig;

    type: HTTP.Config.CacheRuleType;

    pattern: string[];

    private patternMatch?: RegExp;

    constructor(node: Partial<HTTP.Config.CacheRuleNode> | undefined, type: HTTP.Config.CacheRuleType, context: CacheConfig) {
        this.context = context;

        this.type = node?.type ?? type;
        this.pattern = (node?.pattern ?? []).map(v => this.sanitizeKey(v));
    }

    abstract values(r: NginxHTTPRequest): HTTP.Config.CacheRuleArgs;

    sanitizeKey(key: string): string {
        return key;
    }

    test(key: string): boolean {
        if (!this.patternMatch) {
            const items = [];

            for (let item of this.pattern) {
                items.push(
                    item
                        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
                        .replace(/[?]/g, '.')
                        .replace(/[*]/g, '.*')
                );
            }

            this.patternMatch = new RegExp("^(" + items.join('|') + ")$");
        }

        const match = this.patternMatch;


        return match.test(this.sanitizeKey(key));
    }

    get(r: NginxHTTPRequest): HTTP.Config.CacheValue {
        const type = this.type;

        if (type === "none") {
            return new CacheValue({});
        }

        const values = this.values(r),
            result: HTTP.Config.CacheRuleArgs = {};

        if (type === "all") {
            return new CacheValue(values);
        }

        for (let key in values) {

            const match = this.test(key);

            if (type === "include") {
                if (match) {
                    result[key] = values[key];
                }
            } else if (type === "exclude") {
                if (!match) {
                    result[key] = values[key];
                }
            }
        }

        return new CacheValue(result);
    }
}

export class CacheRuleHeaderConfig extends CacheRuleConfig {
    values(r: NginxHTTPRequest): HTTP.Config.CacheRuleArgs {
        const values: HTTP.Config.CacheRuleArgs = {};

        for (let key in r.headersIn) {
            if (key !== 'Cookie') {
                values[key] = [r.headersIn[key]];
            }
        }

        return values;
    }

    sanitizeKey(key: string): string {
        return key
            .split(/[\-_]/)
            .map(v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase())
            .join("-");
    }
}

export class CacheRuleCookieConfig extends CacheRuleConfig {
    values(r: NginxHTTPRequest): HTTP.Config.CacheRuleArgs {
        const
            values: HTTP.Config.CacheRuleArgs = {},
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

export class CacheRuleArgsConfig extends CacheRuleConfig {

    values(r: NginxHTTPRequest): HTTP.Config.CacheRuleArgs {
        const
            values: HTTP.Config.CacheRuleArgs = {},
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
