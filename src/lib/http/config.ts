import {LocationConfig} from "~/lib/http/config/LocationConfig";
import toBoolean from "~/lib/helper/toBoolean";


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

    public readonly debug: boolean;

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

        this.debug = toBoolean(config?.debug);
    }

    public getDomain(r: NginxHTTPRequest): string {
        const server = this.server;
        return server.host !== "" ? server.host : (r.variables.host ?? 'localhost');
    }

    public getHost(r: NginxHTTPRequest): string {
        const
            scheme = r.variables.scheme ?? "http",
            domain = this.getDomain(r);

        return scheme + "://" + domain;
    }

    private _location?: LocationConfig;

    public getCurrentLocation(r: NginxHTTPRequest): LocationConfig {
        if (!this._location) {
            let _l :LocationConfig|null = null;

            const location = this.location;

            for (let l of location) {
                if (l.test(r.uri)) {
                    _l = l;
                    break;
                }
            }

            if (!_l) {
                _l = new LocationConfig({}, this);
            }

            this._location = _l;

            r.variables.njs_http_location = this.getDomain(r) + ":" + (_l.name === "" ? "*undefined*" : _l.name);
        }

        return this._location;
    }

    public getCachePurgeKey(r: NginxHTTPRequest) {
        const
            _uri = r.variables['njs_http_cache_purge_uri'],
            uri = _uri && _uri !== "" ? _uri : r.uri,
            host = this.getHost(r);

        if (uri.endsWith("*")) {
            return host + uri;
        } else {
            return host + uri + "#*";
        }
    }
}
