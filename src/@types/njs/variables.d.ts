interface NginxVariables {
    /**
     * サーバー設定を収めたJSONファイルパス
     */
    njs_http_config?: NjsStringLike

    njs_http_location?: NjsStringLike

    njs_http_debug?: NjsStringLike
    njs_http_cache_key?: NjsStringLike
    njs_http_cache_key_raw?: NjsStringLike
    njs_http_cache_purge_uri?: NjsStringLike
    njs_http_cache_purge_key?: NjsStringLike
    njs_http_cache_bypass?: NjsStringLike
    njs_http_cache_nocache?: NjsStringLike
    njs_http_cache_expires?: NjsStringLike
    njs_http_cache_age?: NjsStringLike
}
