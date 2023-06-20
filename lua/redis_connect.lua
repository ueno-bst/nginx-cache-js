local _M = {}

function _M:get()
    local redis = require('resty.redis')
    local con, err = redis:new()

    if not con then
        return nil, "Failed to create redis variable, error -> " .. err
    end

    assert(con:connect("172.27.0.2", 6379))

    if not con then
        return nil, "Failed to connect to redis, error -> " .. err
    end

    con:set_timeout(10000)

    return con, nil
end

return _M
