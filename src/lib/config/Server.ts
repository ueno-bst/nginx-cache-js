import loadConfig from "~/lib/helper/loadConfig";
import {r} from "~/lib/request";
import {ServerConfig} from "~/@types/http/config";
import {Location} from "~/lib/config/Location";
import {UriPattern} from "~/lib/config/UriMatch";

export class Server {
    public static load(path: string): Server {
        return new Server(loadConfig(path));
    }

    protected config: ServerConfig;

    constructor(config: ServerConfig) {
        this.config = config;
    }

    get name() {
        return this.config.name;
    }

    get description() {
        return this.config.description;
    }

    get debug() {
        return this.config.debug ?? false;
    }

    get hosts() {
        return this.config.host;
    }

    get host() {
        return this.hosts[0];
    }

    get aliasHost() {
        return this.hosts.slice(1);
    }

    get locations() {
        return this.config.location;
    }

    get schema(): string {
        return r.variables.scheme ?? 'http';
    }

    private _current?: Location;

    public currentLocation(): Location {
        if (this._current) {
            return this._current
        }

        const
            locations = this.locations,
            uri = r.uri;

        let l, i = -1;

        for (let index = 0; index < locations.length; index++) {
            const location = locations[index];

            if (location.uri) {
                const match = new UriPattern(location.uri);

                if (match.test(uri)) {
                    i = index;
                    l = location;
                    break;
                }
            }
        }

        const current = l ? new Location(l, i) : new Location({
            name: '!undefined!',
            uri: ['*'],
        });

        r.variables.ngc_location = this.name + ":" + current.index + ":" + current.name;

        return this._current = current;
    }

    /**
     * キャッシュのプレフィックスを追加
     */
    private getCachePrefix(): string {
        return "//" + this.host;
    }

    /**
     * キャッシュキーを作成する
     */
    public getCacheKey(): string {
        const
            location = this.currentLocation(),
            cache = location.cache;

        if (!cache.active) {
            return "";
        }

        const attribute = cache.getAttribute(),
            bypass = cache.getBypass(),
            uri = this.getCachePrefix() + r.uri,
            key = uri + "#" + (attribute !== "" ? require('crypto').createHash('sha256').update(attribute).digest('hex') : "");

        r.variables.ngc_cache_min_expire = cache.expire.min + "";
        r.variables.ngc_cache_default_expire = cache.expire.default + "";
        r.variables.ngc_cache_max_expire = cache.expire.max + "";

        r.variables.ngc_cache_key = key;
        r.variables.ngc_cache_key_raw = uri + "#" + attribute;
        r.variables.ngc_cache_bypass = bypass;
        r.variables.ngc_cache_nocache = bypass;

        return key;
    }

    /**
     * キャッシュ開放キーを返却する
     */
    public getCachePurgeKey(): string {
        const
            prefix = this.getCachePrefix(),
            _uri = r.variables['ngc_cache_purge_uri'],
            uri = _uri && _uri !== "" ? _uri : r.uri,
            key = uri.endsWith("*") ? prefix + uri : prefix + uri + "#*";

        r.variables.ngc_cache_pure_key_raw = key;

        return key;
    }
}
