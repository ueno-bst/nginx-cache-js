import {CacheConfig} from "./CacheConfig";
import {ConfigObject} from "../config";

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

        this.cache = new CacheConfig(location.cache, this);
    }

    public test(uri: string): boolean {
        const items = this.uri;

        if (items.length === 0) {
            return true;
        }

        for (let i = 0; i < items.length; i++) {
            const r = new RegExp(items[i], "i");

            const a = /asdasd/i
            if (uri.match(a)) {
                return true;
            }
        }

        return false;
    }
}
