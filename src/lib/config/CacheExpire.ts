import {ExpireConfig} from "~/@types/http/config";

export default class CacheExpire {
    private readonly config: ExpireConfig;

    constructor(config: ExpireConfig) {
        this.config = config;
    }

    get default() {
        return this.config.default ?? 86400;
    }

    get min() {
        return this.config.min ?? 0;
    }

    get max() {
        return this.config.max ?? 31536000;
    }
}
