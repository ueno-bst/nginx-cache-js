declare namespace HTTP.Config {
    interface Cache {
        expire: CacheExpire,
        rule: CacheRule
    }

    interface CacheExpire {
        min: number,
        max: number,
    }

    interface CacheRule {
        header: CacheRuleNode,
        args: CacheRuleNode,
        cookie: CacheRuleNode,
    }

    interface CacheRuleNode {
        type: CacheRuleType,
        pattern: string[],
    }

    type CacheRuleType = "none" | "all" | "include" | "exclude"
}
