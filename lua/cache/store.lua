local key = assert(ngx.var.redis_key, "no key found")
local value = assert(ngx.req.get_body_data(), "no value found")
local resty = require('ngx.re')
local time = ngx.http_time(ngx.time())

local redis, err = require("redis_connect"):get()

if err then
    ngx.log(ngx.ERR, err)
    ngx.exit(500)
end

local values = resty.split(value, "\r\n\r\n", nil, nil, 2)
values[1] = values[1] .. "\r\nDate: " .. time

assert(redis:set("ncache:" .. key, values[1] .. "\r\n\r\n" .. values[2]))
assert(redis:expire("ncache:" .. key, 3600))
