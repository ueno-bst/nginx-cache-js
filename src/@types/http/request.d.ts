declare namespace Http {
    interface RequestInterface {
        id: string,
        scheme: string,
        host: string,
        port: string,
        uri: string,
        args: RequestParams<string | boolean>,
        headers: RequestParams<string>,
        cookies: RequestParams<string>,
    }

    type RequestParams<T = string | number | boolean> = Record<string, T | T[]>
}
