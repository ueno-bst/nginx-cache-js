import {LocationConfig} from "./config/LocationConfig";

export class ConfigObject implements HTTP.Config.Root {
    public static load(path: string): ConfigObject | null {
        const fs = require('fs');

        try {
            fs.accessSync(path, fs.constants.R_OK);
            const buffer = fs.readFileSync(path, 'utf8');

            return new ConfigObject(JSON.parse(buffer));
        } catch {
        }

        return null;
    }

    public readonly name: string;
    public readonly description: string;
    public readonly location: LocationConfig[] = [];

    public readonly server: HTTP.Config.Server;

    constructor(config: Partial<HTTP.Config.Root>) {
        this.name = config.name ?? "";
        this.description = config.description ?? "";

        this.server = {
            host: config.server?.host ?? '',
            alias: config.server?.alias ?? [],
        }

        if (config.location) {
            for (let index = 0; index < config.location.length; index++) {
                this.location.push(new LocationConfig(config.location[index], this));
            }
        }
    }

    public getHost(r: NginxHTTPRequest): string {
        const
            server = this.server,
            scheme = r.variables.scheme ?? "http",
            host = server.host !== '' ? server.host : (r.variables.host ?? 'localhost');

        r.warn(scheme + "://" + host);
        return scheme + "://" + host;
    }

    public getCurrentLocation(r: NginxHTTPRequest): LocationConfig {
        const location = this.location;
        for (let l of location) {
            if (l.test(r.uri)) {
                return l;
            }
        }

        return new LocationConfig({}, this);
    }

    public getCachePurgeKey(r: NginxHTTPRequest) {
        const
            _uri =  r.variables['njs_http_cache_purge_uri'],
            uri = _uri && _uri !== "" ? _uri : r.uri,
            host = this.getHost(r);

        if (uri.endsWith("*")) {
            return host + uri;
        } else {
            return host + uri + "#*";
        }
    }
}
