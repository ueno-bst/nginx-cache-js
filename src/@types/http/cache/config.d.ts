declare namespace Http.Cache {
    interface ConfigInterface {
        /**
         * 設定名
         */
        name: string,
        /**
         * 説明書き
         */
        description?: string,
        /**
         * キャッシュに使用するホスト名. 空の場合はリクエストの Host 名が使用される
         */
        host?: string,
        /**
         * デバッグモードの有無
         */
        debug?: boolean,
        /**
         * 対象とするURIパターン
         */
        uri: Array<string>,
        /**
         * 有効期限の最大値
         */
        expire: {
            min: number,
            max: number,
        }
        keys?: ConfigKeyInterface,
    }

    interface ConfigKeyInterface {
        method?: ('HEAD' | 'GET' | 'POST' | string)[],
        cookie?: Http.Cache.RuleInterface,
        header?: Http.Cache.RuleInterface,
        query?: Http.Cache.RuleInterface,
    }
}
