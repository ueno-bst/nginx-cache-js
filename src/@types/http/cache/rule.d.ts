declare namespace Http.Cache {
    interface RuleInterface {
        type: RuleType | string,
        pattern: string[],
    }

    type RuleType = "all" | "none" | "include" | "exclude"
}