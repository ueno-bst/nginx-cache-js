declare namespace HTTP.Config {
    interface Location {
        name:string,
        description:string,
        uri:string[],
        cache: HTTP.Config.Cache
    }
}
