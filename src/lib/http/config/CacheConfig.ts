import {LocationConfig} from "~/lib/http/config/LocationConfig";
import {CacheRuleArgsConfig, CacheRuleCookieConfig, CacheRuleHeaderConfig} from "~/lib/http/config/CacheRuleConfig";
import toBoolean from "~/lib/helper/toBoolean";
import {r} from "~/lib/request";
import CacheBypassException from "~/lib/error/CacheBypassException";

export class CacheConfig implements HTTP.Config.Cache {
    private readonly context: LocationConfig;

    public readonly enable: boolean;

    expire: CacheExpireConfig;
    rule: HTTP.Config.CacheRule;

    constructor(cache: Partial<HTTP.Config.Cache> | undefined, context: LocationConfig) {
        this.context = context;

        this.enable = toBoolean(cache?.enable, true);

        this.expire = new CacheExpireConfig(cache?.expire, this);

        this.rule = {
            header: new CacheRuleHeaderConfig(cache?.rule?.header, "none", this),
            cookie: new CacheRuleCookieConfig(cache?.rule?.cookie, "none", this),
            args: new CacheRuleArgsConfig(cache?.rule?.args, "none", this),
        }
    }

    public getKey() {
        if (!this.enable) {
            return "";
        }

        try {
            const
                uri = this.context.getHost() + r.uri,
                attribute = this.getAttribute();

            r.variables.ngc_cache_key_raw = buildCacheKey(uri, attribute);

            return r.variables.ngc_cache_key = buildCacheKey(uri, attribute, true);
        } catch (e) {
            if (e instanceof CacheBypassException) {
                return "";
            } else {
                throw e;
            }
        }
    }

    public getAttribute(): string {
        const
            attributes = [],
            args = this.rule.args.get().toString(),
            header = this.rule.header.get().toString(),
            cookie = this.rule.cookie.get().toString();

        attributes.push('scheme:' + this.context.context.getScheme())

        if (args !== "") {
            attributes.push("args:[" + args + "]");
        }

        if (header !== "") {
            attributes.push("header:[" + header + "]");
        }

        if (cookie !== "") {
            attributes.push("cookie:[" + cookie + "]");
        }

        return attributes.join(";");
    }
}

class CacheExpireConfig implements HTTP.Config.CacheExpire {
    max: number;
    min: number;

    private context: CacheConfig;

    constructor(expire: Partial<HTTP.Config.CacheExpire> | undefined, context: CacheConfig) {
        this.context = context;

        this.max = expire?.max ?? 3600;
        this.min = expire?.min ?? 0;
    }
}

function buildCacheKey(uri: string, attribute: string, crypto: boolean = false) {
    // return uri + "#" + attribute;
    return uri + "#" + (attribute === "" ? "" : (crypto ? sha256(attribute) : attribute));
}

function sha256(text: string): string {
    return require('crypto').createHash('sha256').update(text).digest('hex');
}
