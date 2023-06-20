ngx.req.read_body()

local function response(status, body)
    local cjson = require "cjson.safe"
    ngx.status = status
    ngx.say(cjson.encode(body))
    ngx.exit(ngx.OK)
end

local function sanitizeUrl(v)
    if not (type(v) == "string") or string.len(v) == 0 then
        return nil, "Not a URL"
    end

    -- drop schema
    local pos, len = string.find(v, "://")

    if pos == nil then
        return nil, "No schema in URL"
    end

    v = "//" .. string.sub(v, len + 1)

    -- drop bookmark
    pos, len = string.find(v, "#")

    if not (pos == nil) then
        v = string.sub(v, 1, pos - 1)
    end

    -- drop query
    pos, len = string.find(v, "?")

    if not (pos == nil) then
        v = string.sub(v, 1, pos - 1)
    end

    -- with out last wildcard
    local w = string.sub(v, -1) == "*"

    if w then
        v = string.sub(v, 1, string.len(v) - 1)
    end

    if string.find(v, '/') == 0 then
        return nil, "Invalid URL"
    end

    -- escape meta strings
    v = string.gsub(v, "([]\\[*?])", "\\%1")

    -- append wildcard
    if w then
        v = v .. "*"
    else
        v = v .. "#*"
    end

    return "ncache:" .. v, nil
end

local function countTable(t)
    local count = 0

    for n in pairs(t) do
        count = count + 1
    end

    return count
end

local function sanitizeTable(t)
    local values = {}
    local origins = {}
    local keys = {}

    for i, origin in pairs(t) do
        if not (type(origins[origin]) == "nil") then
            goto continue
        end

        local key, err = sanitizeUrl(origin)

        if err then
            table.insert(values, { src = origin, valid = false, key = "", message = err })
            goto continue
        end

        if key == nil or not (type(keys[key]) == "nil") then
            goto continue
        end

        table.insert(values, { src = origin, valid = true, key = key, message = nil });

        keys[key] = true

        :: continue ::
    end

    -- sort keys
    local function cmp(a, b)
        return string.len(a.key) < string.len(b.key)
    end

    table.sort(values, cmp)

    -- drop duplicate keys
    for i, v1 in pairs(values) do
        if v1.valid == true and string.len(v1.key) > 0 and not (string.sub(v1.key, -2) == "#*") and (string.sub(v1.key, -1) == "*") then
            local k = string.sub(v1.key, 1, string.len(v1.key) - 1)
            for j, v2 in pairs(values) do
                if not (i == j) and v2.valid == true then
                    if string.find(v2.key, k, 1, true) == 1 then
                        v2.valid = false
                        v2.message = "Duplicate Request from " .. v1.src
                    end
                end
            end
        end
    end

    return values
end

local cjson = require "cjson.safe"
local method = ngx.req.get_method()
local body = ngx.req.get_body_data()

-- リクエストメソッドの確認
if not (method == "DELETE") then
    response(ngx.HTTP_NOT_ALLOWED, { status = "405 Method Not Allowed" })
end

if body == nil or not (type(body) == "string") then
    response(ngx.HTTP_BAD_REQUEST, { status = "400 Bad Request" })
end

if string.len(body) > 32768 then
    response(413, { status = "413 Payload Too Large", message = "The request body is more than 32KB." })
end

-- リクエストボディを JSON分解
cjson.decode_max_depth(2)
local req, err = cjson.decode(body)

-- JSONデータではない
if err or not (type(req) == "table") then
    response(415, { status = "415 Unsupported Media Type", message = err })
end

-- JSONデータが長大すぎる
if countTable(req) > 50 then
    response(413, { status = "413 Payload Too Large", message = "More than 50 request bodies." })
end

local origins = sanitizeTable(req)

-- REDIS 接続
local redis, err = require("redis_connect"):get()

if err then
    response(503, { status = "503 Service Unavailable", message = err })
end

local data = {}
local excludes = {}

for i, o in pairs(origins) do
    if o.valid == false then
        excludes[o.src] = o.message
        goto continue
    end

    data[o.src] = false

    if o.key == nil then
        goto continue
    end

    data[o.src] = 0

    local keys = redis:keys(o.key)

    if not keys then
        goto continue;
    end

    for i2, k in pairs(keys) do
        data[o.src] = data[o.src] + 1
        redis:del(k)
    end

    :: continue ::
end

response(200, { status = "200 OK", data = data, excludes = excludes })
