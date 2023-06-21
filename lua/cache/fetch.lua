-- キャッシュキーを取得
local key = assert(ngx.var.redis_key, "no key found")

--
-- Redisに接続
--
local redis, err = require("redis_connect"):get()

if err then
    ngx.log(ngx.ERR, err)
    ngx.exit(500)
end

-- *******************
-- キャッシュを取得
-- *******************
local value = assert(redis:get("ngc:" .. key))

if type(value) == "string" and string.len(value) > 0 then
    -- キャッシュ取得に成功
    ngx.print(value)
else
    -- キャッシュ取得に失敗
    ngx.exit(404)
end

