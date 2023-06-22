-- キャッシュキーを取得
local key = assert(ngx.var.redis_key, "no key found")

--
-- Redisに接続
--
local redis = require('redis_connect')
local con, err = redis:get()

if err then
    ngx.log(ngx.ERR, err)
    ngx.exit(500)
end

-- *******************
-- キャッシュを取得
-- *******************
local value = assert(con:get(redis:prefix() .. ":" .. key))

if type(value) == "string" and string.len(value) > 0 then
    -- キャッシュ取得に成功
    ngx.print(value)
else
    -- キャッシュ取得に失敗
    ngx.exit(404)
end

