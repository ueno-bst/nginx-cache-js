export class CacheValue {
    private readonly values: CacheValueType;

    private readonly glue: string;

    private readonly separator: string;

    constructor(values: CacheValueType, glue: string = "=", separator: string = "&") {
        this.values = values;
        this.glue = glue;
        this.separator = separator;
    }

    private empty(): boolean {
        return Object.keys(this.values).length === 0;
    }

    private notEmpty(): boolean {
        return !this.empty();
    }

    public toString() {
        const
            values = this.values,
            items = [];

        for (let key of Object.keys(values).sort()) {
            const value = values[key].sort();

            for (let v of value) {
                if (v === undefined) {
                    items.push(encodeURIComponent(key));
                } else {
                    items.push(encodeURIComponent(key) + this.glue + encodeURIComponent(v));
                }
            }
        }

        return items.join(this.separator);
    }
}
