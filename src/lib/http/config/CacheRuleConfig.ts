import {CacheConfig} from "./CacheConfig";


abstract class CacheRuleConfig implements HTTP.Config.CacheRuleNode {
    private context: CacheConfig;

    type: HTTP.Config.CacheRuleType;
    pattern: string[];

    constructor(node: Partial<HTTP.Config.CacheRuleNode> | undefined, type: HTTP.Config.CacheRuleType, context: CacheConfig) {
        this.context = context;

        this.type = node?.type ?? type;
        this.pattern = node?.pattern ?? [];
    }
}

export class CacheRuleHeaderConfig extends CacheRuleConfig {



}

export class CacheRuleCookieConfig extends CacheRuleConfig {

}

export class CacheRuleArgsConfig extends CacheRuleConfig {

}
