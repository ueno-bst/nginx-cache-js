-- @class Cache
local _M = {}

local resty = require('ngx.re')

--
-- Nginx の変数を取得する
--
local function get_var(key)
    return ngx.var[key]
end

local cache_key = assert(ngx.var.redis_key, "no key found")

-- キャッシュ有効期限の最小値
local cache_min_expire = ngx.var.ngc_cache_min_expire
-- キャッシュ有効期限の最大値を取得
local cache_max_expire = ngx.var.ngc_cache_max_expire
-- キャッシュ有効期限のデフォルト値を取得
local cache_default_expire = ngx.var.ngc_cache_default_expire

--
-- 末尾の空白文字を削除する
--
local function trim(value)

    local s = ngx.re.sub(value, "([ \r\n\t]*)$", "", "s")

    if s then
        return s
    end

    return value
end

function _M:key()
    return cache_key
end

function _M:body()
    return assert(ngx.req.get_body_data(), "no body found")
end

function _M:min_expire()
    if cache_min_expire then
        return tonumber(cache_min_expire)
    end

    return 0
end

function _M:default_expire()
    if cache_default_expire then
        return tonumber(cache_default_expire)
    end

    return 60
end

function _M:max_expire()
    if cache_max_expire then
        return tonumber(cache_max_expire)
    end

    return 60
end

function _M:expire(v)
    if type(v) ~= "number" then
        v = _M:default_expire()
    end

    local min = _M:min_expire()

    if v < min then
        v = min
    end

    local max = _M:max_expire()

    if v > max then
        v = max
    end

    if v < 0 then
        v = 0
    end

    return v
end

-- HTTPレスポンスを ステータス行, ヘッダー列, 本文 に分割する処理
function _M:parse_body()
    local match, err = ngx.re.match(_M:body(), "^(.*?)\r\n(.*?)\r\n\r\n(.*)$", "s")

    if not match then
        if err then
            return nil, err;
        end

        return nil, nil
    end

    local headers = {}

    if match[2] then
        local values = resty.split(trim(match[2]), "\r\n")

        for i = 1, #values do
            local value = resty.split(values[i], ":[ ]*", nil, nil, 2)

            if value then
                if not headers[value[1]] then
                    headers[value[1]] = {}
                end

                table.insert(headers[value[1]], value[2])
            end
        end
    end

    local values = {
        status = trim(match[1]),
        headers = headers,
        body = match[3],
    }

    return values, nil
end

-- ステータス行, ヘッダー列, 本文 を HTTPレスポンス に結合する処理
function _M:build_body(status, headers, body)
    local header = ""

    if type(headers) == "table" then
        for key, values in pairs(headers) do
            local value_type = type(values)

            if value_type == "string" then
                header = header .. key .. ": " .. values .. "\r\n"
            else
                if value_type == "table" then
                    for i = 1, #values do
                        header = header .. key .. ": " .. values[i] .. "\r\n"
                    end
                end
            end
        end
    end

    return status .. "\r\n" .. header .. "\r\n" .. body
end

return _M
