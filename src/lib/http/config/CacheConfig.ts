import {LocationConfig} from "./LocationConfig";
import {CacheRuleArgsConfig, CacheRuleCookieConfig, CacheRuleHeaderConfig} from "./CacheRuleConfig";

export class CacheConfig implements HTTP.Config.Cache {
    public readonly context: LocationConfig;

    expire: CacheExpireConfig;
    rule: HTTP.Config.CacheRule;

    constructor(cache: Partial<HTTP.Config.Cache> | undefined, context: LocationConfig) {
        this.context = context;

        this.expire = new CacheExpireConfig(cache?.expire, this);

        this.rule = {
            header: new CacheRuleHeaderConfig(cache?.rule?.header, "none", this),
            cookie: new CacheRuleCookieConfig(cache?.rule?.cookie, "none", this),
            args: new CacheRuleArgsConfig(cache?.rule?.args, "none", this),
        }
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
