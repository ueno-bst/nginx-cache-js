import {LocationConfig} from "~/lib/http/config/LocationConfig";
import toBoolean from "~/lib/helper/toBoolean";
import loadConfig from "~/lib/helper/loadConfig";
import {r} from "~/lib/request";

export class ConfigObject implements HTTP.Config.Root {
    public static load(path: string): ConfigObject {
        return new ConfigObject(loadConfig(path));
    }

    public readonly name: string;
    public readonly description: string;
    public readonly location: LocationConfig[] = [];

    public readonly server: HTTP.Config.Server;

    public readonly debug: boolean;

    constructor(config: Partial<HTTP.Config.Root>) {
        this.name = config.name ?? r.variables.host ?? "localhost";
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

    public getScheme(): string {
        return r.variables.scheme ?? "http";
    }

    public getDomain(): string {
        const server = this.server;
        return server.host !== "" ? server.host : (r.variables.host ?? 'localhost');
    }

    public getHost(): string {
        return "//" + this.getDomain();
    }

    private _location?: LocationConfig;

    public getCurrentLocation(): LocationConfig {
        if (!this._location) {
            let _l: LocationConfig | null = null;

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

            r.variables.ngc_location = this.name + ":" + (_l.name === "" ? "*undefined*" : _l.name);
        }

        return this._location;
    }

    public getCachePurgeKey() {
        const
            _uri = r.variables['ngc_cache_purge_uri'],
            uri = _uri && _uri !== "" ? _uri : r.uri,
            host = this.getHost();

        if (uri.endsWith("*")) {
            return host + uri;
        } else {
            return host + uri + "#*";
        }
    }
}
