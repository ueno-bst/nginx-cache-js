import {ConfigObject} from "~/lib/http/config";
import {CacheConfig} from "~/lib/http/config/CacheConfig";

export class LocationConfig implements HTTP.Config.Location {
    public readonly context: ConfigObject;

    public readonly name: string;
    public readonly description: string;
    public readonly uri: string[];
    public readonly cache: CacheConfig;

    constructor(location: Partial<HTTP.Config.Location>, context: ConfigObject) {
        this.context = context;

        this.name = location.name ?? "";
        this.description = location.description ?? "";

        this.uri = location.uri ?? [];

        if (location.cache) {
            this.cache = new CacheConfig(location.cache, this);
        } else {
            this.cache = new CacheConfig({disable: true}, this);
        }
    }

    /**
     * 現在のURIがLocationと一致するか
     * @param uri
     */
    public test(uri: string): boolean {
        const items = this.uri;

        if (items.length === 0) {
            return true;
        }

        for (let i = 0; i < items.length; i++) {
            const r = new RegExp(items[i], "i");

            if (uri.match(r)) {
                return true;
            }
        }

        return false;
    }

    public getHost(): string {
        return this.context.getHost();
    }

    public getCacheKey() {
        return this.cache.getKey();
    }
}
