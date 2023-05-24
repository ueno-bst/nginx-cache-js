declare namespace HTTP.Config {
    interface Root {
        name: string,
        description: string,
        server: HTTP.Config.Server,
        location: HTTP.Config.Location[],
    }
}
