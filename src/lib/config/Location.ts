import {LocationConfig} from "~/@types/http/config";
import {UriPattern} from "~/lib/config/UriMatch";
import Cache from "~/lib/config/Cache";

export class Location {
    public readonly index: number;

    private readonly config: LocationConfig;

    constructor(config: LocationConfig, index: number = -1) {
        this.config = config;
        this.index = index;
    }

    get name() {
        return this.config.name;
    }

    get description() {
        return this.config.description;
    }

    get uri() {
        return new UriPattern(this.config.uri);
    }

    get cache() {
        return new Cache(this.config.cache ?? {enable: false});
    }
}
