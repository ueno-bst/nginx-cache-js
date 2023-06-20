local key = assert(ngx.var.redis_key, "no key found")
local redis, err = require("redis_connect"):get()
local ngx_re = require('ngx.re')
local cjson = require('cjson')

if err then
    ngx.log(ngx.ERR, err)
    ngx.exit(500)
end

local value = assert(redis:get("ncache:" .. key))

if type(value) == "string" and string.len(value) > 0 then
    ngx.print(value)
else
    ngx.exit(404)
end

