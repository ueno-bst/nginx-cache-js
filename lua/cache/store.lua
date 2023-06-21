-- キャッシュキーを取得
local key = assert(ngx.var.redis_key, "no key found")
-- キャッシュ値を取得
local value = assert(ngx.req.get_body_data(), "no value found")

--
-- Redisに接続
--
local redis, err = require("redis_connect"):get()

if err then
    ngx.log(ngx.ERR, err)
    ngx.exit(500)
end

--
-- キャッシュ保存時にコンテンツヘッダに作成日(Date) を付与する
--
local resty = require('ngx.re')
local time = ngx.http_time(ngx.time())
local values = resty.split(value, "\r\n\r\n", nil, nil, 2)
values[1] = values[1] .. "\r\nDate: " .. time

-- *******************
-- キャッシュ保存処理
-- *******************

-- キャッシュを保存
assert(redis:set("ncache:" .. key, values[1] .. "\r\n\r\n" .. values[2]))
-- キャッシュの有効期限を保存
assert(redis:expire("ncache:" .. key, 3600))
