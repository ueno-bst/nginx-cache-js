local _M = {}

function _M:get()
    local redis = require('resty.redis')
    local con, err = redis:new()

    con:set_timeouts(100, 1000, 1000)

    if not con then
        return nil, "Failed to create redis variable, error -> " .. err
    end

    assert(con:connect(_M:host(), _M:port()))

    if not con then
        return nil, "Failed to connect to redis, error -> " .. err
    end

    return con, nil
end

function _M:host()
    local host = ngx.var.redis_host;

    if host then
        return host
    end

    return "127.0.0.1"
end

function _M:port()
    local port = ngx.var.redis_port;

    if port then
        return port
    end

    return 6379
end

return _M
