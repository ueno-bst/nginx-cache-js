declare namespace HTTP.Config {
    interface Root {
        name: string,
        debug: boolean,
        description: string,
        server: HTTP.Config.Server,
        location: HTTP.Config.Location[],
    }
}
