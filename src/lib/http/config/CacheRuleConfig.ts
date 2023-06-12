import {CacheConfig} from "~/lib/http/config/CacheConfig";
import {CacheValue} from "~/lib/http/config/CacheValue";
import {r} from "~/lib/request";
import {isArray} from "lodash-es";
import CacheBypassException from "~/lib/error/CacheBypassException";

export abstract class CacheRuleConfig implements HTTP.Config.CacheRuleNode {
    private context: CacheConfig;

    type: HTTP.Config.CacheRuleType;

    pattern: string[];

    private patternMatch: RegExp | false | null = null;

    bypass: string[];

    private bypassMatch: RegExp | false | null = null;

    constructor(node: Partial<HTTP.Config.CacheRuleNode> | undefined, type: HTTP.Config.CacheRuleType, context: CacheConfig) {
        this.context = context;

        this.type = node?.type ?? type;

        const
            pattern = node?.pattern,
            bypass = node?.bypass;

        this.pattern = (isArray(pattern) ? pattern : []).map(v => this.sanitizeKey(v));
        this.bypass = (isArray(bypass) ? bypass : []).map(v => this.sanitizeKey(v));
    }

    abstract values(): HTTP.Config.CacheRuleArgs;

    sanitizeKey(key: string): string {
        return key;
    }

    test(key: string): boolean {
        if (this.patternMatch === null) {
            this.patternMatch = toRegex(this.pattern);
        }

        const match = this.patternMatch;

        if (match === false) {
            return false;
        }


        return match.test(this.sanitizeKey(key));
    }

    isBypass(key: string): boolean {
        if (this.bypassMatch === null) {
            this.bypassMatch = toRegex(this.bypass);
        }

        const match = this.bypassMatch;

        if (match === false) {
            return false;
        }

        return match.test(this.sanitizeKey(key));
    }

    /**
     *
     * @throws CacheBypassException
     */
    get(): HTTP.Config.CacheValue {
        const type = this.type,
            values = this.values(),
            result: HTTP.Config.CacheRuleArgs = {};

        // バイパスキーを含むパラメータの存在を確認する
        for (let key in values) {
            if (this.isBypass(key)) {
                throw new CacheBypassException("bypass from " + key);
            }
        }

        if (type === "none") {
            return new CacheValue({});
        }

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

function toRegex(values: string[]): RegExp | false {
    if (values.length === 0) {
        return false;
    }

    const items = values.map(v =>
        v
            .replace(/[.+^${}()|[\]\\]/g, '\\$&')
            .replace(/[?]/g, '.')
            .replace(/[*]/g, '.*'));

    return new RegExp("^(" + items.join('|') + ")$");
}

export class CacheRuleHeaderConfig extends CacheRuleConfig {
    values(): HTTP.Config.CacheRuleArgs {
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
    values(): HTTP.Config.CacheRuleArgs {
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

    values(): HTTP.Config.CacheRuleArgs {
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
