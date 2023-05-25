import {LocationConfig} from "./LocationConfig";
import {CacheRuleArgsConfig, CacheRuleCookieConfig, CacheRuleHeaderConfig} from "./CacheRuleConfig";

export class CacheConfig implements HTTP.Config.Cache {
    public readonly context: LocationConfig;

    public readonly debug: boolean;
    expire: CacheExpireConfig;
    rule: HTTP.Config.CacheRule;

    constructor(cache: Partial<HTTP.Config.Cache> | undefined, context: LocationConfig) {
        this.context = context;

        this.debug = cache?.debug ?? false;

        this.expire = new CacheExpireConfig(cache?.expire, this);

        this.rule = {
            header: new CacheRuleHeaderConfig(cache?.rule?.header, "none", this),
            cookie: new CacheRuleCookieConfig(cache?.rule?.cookie, "none", this),
            args: new CacheRuleArgsConfig(cache?.rule?.args, "none", this),
        }
    }

    public getKey(r: NginxHTTPRequest) {
        const
            uri = this.context.getHost(r) + r.uri + "#",
            attribute = this.getAttribute(r),
            raw = uri + (attribute === "" ? "" : attribute),
            key = uri + (attribute === "" ? "" : sha256(attribute));

        r.variables['njs_http_cache_key_raw'] = raw;
        r.variables['njs_http_cache_key'] = key;

        return key;
    }

    public getAttribute(r: NginxHTTPRequest): string {
        const
            attributes = [],
            args = this.rule.args.get(r).toString(),
            header = this.rule.header.get(r).toString(),
            cookie = this.rule.cookie.get(r).toString();

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

    public getPurgeKey(r: NginxHTTPRequest) {
        return "";
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


function sha256(text: string): string {
    return require('crypto').createHash('sha256').update(text).digest('hex');
}
