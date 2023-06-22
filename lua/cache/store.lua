local cache = require('cache')
local redis = require('redis_connect')

-- キャッシュキーを取得
local key = cache:key()

local values = cache:parse_body();

--
-- キャッシュ保存時にコンテンツヘッダに作成日(Date) を付与する
--
values.headers['Date'] = ngx.http_time(ngx.time())

--
-- 有効期限を産出
--
local expire = nil

if values.headers['Cache-Control'] then
    -- Cache-Control に含まれる max-age 値を使用
    local v = values.headers['Cache-Control'];

    for i = 1, #v do
        local m = ngx.re.match(v[i], "max-age=([0-9]+)")

        if m then
            expire = tonumber(m[1])
        end
    end
else
    if values.headers['Expire'] then
        -- Expire に含まれる 日時を使用
        local v = values.headers['Expire']

        for i = 1, #v do
            local m = ngx.parse_http_time(v[i])

            if m and m > ngx.time() then
                expire = m - ngx.time()
            end
        end
    end
end

expire = cache:expire(expire)

local body = cache:build_body(values.status, values.headers, values.body)


--
-- Redisに接続
--
local con, err = redis:get()

if err then
    ngx.log(ngx.ERR, err)
    ngx.exit(500)
end

-- *******************
-- キャッシュ保存処理
-- *******************

-- キャッシュを保存
assert(con:set(redis:prefix() .. ":" .. key, body))
-- キャッシュの有効期限を保存
assert(con:expire(redis:prefix() .. ":" .. key, expire))
