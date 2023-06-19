import {CacheRuleConfig} from "~/@types/http/config";
import {CacheValue} from "~/lib/config/CacheValue";

export default abstract class CacheRule {
    private readonly config: CacheRuleConfig

    private readonly patternMatch: RegExp | false;

    private readonly bypassMatch: RegExp | false;

    constructor(config: CacheRuleConfig) {
        this.config = config;

        this.patternMatch = toRegex(this.pattern);
        this.bypassMatch = toRegex(this.bypass);
    }

    get type() {
        return this.config.type;
    }

    get pattern() {
        return this.config.pattern ?? [];
    }

    get bypass() {
        return this.config.bypass ?? [];
    }

    /**
     * 検証対象の値セットを取得する
     */
    abstract values(): CacheValueType;

    /**
     * キーの無害化処理
     * @param key
     */
    sanitize(key: string): string {
        return key;
    }

    getAttribute(): CacheValue {
        const
            type = this.type,
            values = this.values(),
            result: CacheValueType = {};


        if (type === 'all') {
            return new CacheValue(values);
        }

        if (type === 'none') {
            return new CacheValue(result);
        }

        const pattern = this.patternMatch;

        if (pattern === false) {
            return new CacheValue(result);
        }

        for (let key in values) {
            key = this.sanitize(key);

            if (type === 'include') {
                if (key.match(pattern)) {
                    result[key] = values[key];
                }
            } else if (type === 'exclude') {
                if (!key.match(pattern)) {
                    result[key] = values[key];
                }
            }
        }

        return new CacheValue(result);
    }

    getBypass() {
        const pattern = this.bypassMatch,
            result: CacheValueType = {},
            values = this.values();

        if (pattern === false) {
            return new CacheValue(result);
        }

        for (let key in values) {
            if (this.sanitize(key).match(pattern)) {
                result[key] = values[key];
            }
        }

        return new CacheValue(result);
    }
}

function toRegex(values: string[], flags?: string): RegExp | false {
    if (values.length === 0) {
        return false;
    }

    const items = values.map(v => v
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/[?]/g, '.')
        .replace(/[*]/g, '.*'));

    return new RegExp("^(" + items.join('|') + ")$", flags);
}
