interface NginxVariables {
    /**
     * サーバー設定を収めたJSONファイルパス
     */
    ngc_config?: NjsStringLike

    ngc_location?: NjsStringLike

    ngc_debug?: NjsStringLike
    ngc_cache_key?: NjsStringLike
    ngc_cache_key_raw?: NjsStringLike
    ngc_cache_purge_uri?: NjsStringLike
    ngc_cache_pure_key_raw?: NjsStringLike
    ngc_cache_bypass?: NjsStringLike
    ngc_cache_nocache?: NjsStringLike

    /**
     * キャッシュの最小保持期間(秒数)
     */
    ngc_cache_min_expire?: NjsStringLike

    /**
     * キャッシュ保持期間のデフォルト値(秒数)
     */
    ngc_cache_default_expire?: NjsStringLike

    /**
     * キャッシュの最長保持期間(秒数)
     */
    ngc_cache_max_expire?: NjsStringLike
}
