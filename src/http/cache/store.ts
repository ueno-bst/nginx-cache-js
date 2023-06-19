let response = "",
    count = 0;

export function store(r: NginxHTTPRequest, data: NjsStringOrBuffer, flags: NginxHTTPSendBufferOptions) {
    response += data;

    r.warn(r.uri + " / " + r.variables.upstream_cache_status + " / count = " + count + " / data = " + (data.constructor.name));

    if (flags.last) {
        r.warn(njs.dump([r.uri, r.variables.upstream_cache_status, response.length, flags]));

        r.sendBuffer(response, flags);
    }

    count++;
}
