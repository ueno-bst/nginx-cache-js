declare namespace HTTP.Config {
    interface Cache {
        enable: boolean,
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
        bypass: string[],

        get(): HTTP.Config.CacheValue;
    }

    interface CacheValue {
        toString(): string;
    }

    type CacheRuleArgs = { [key in string]: (string | undefined)[] };

    type CacheRuleType = "none" | "all" | "include" | "exclude"
}
