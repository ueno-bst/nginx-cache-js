import {URIConfig} from "~/@types/http/config";

export class UriPattern {
    private readonly pattern;

    constructor(pattern: URIConfig | undefined) {
        this.pattern = pattern ?? [];
    }

    test(uri: string): boolean {
        const pattern = this.pattern;

        if (pattern.length === 0) {
            return true;
        }

        for (let value of pattern) {
            if (uri.match(new RegExp(value, 'i'))) {
                return true;
            }
        }

        return false;
    }
}
