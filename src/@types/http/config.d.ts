/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * サーバー設定
 */
export type ServerConfig = {
    /**
     * サーバー名識別子
     */
    name: string;
    /**
     * サーバー説明文
     */
    description?: string;
    server?: {
        host?: string;
        alias?: string[];
        [k: string]: unknown;
    };
    /**
     * サーバードメイン名
     * 最初の値がデフォルトドメインとして使用されます
     *
     * @minItems 1
     */
    host: [string, ...string[]];
    protocol?: ProtocolConfig;
    ssl?: SSLConfig;
    debug?: boolean;
    /**
     * パス設定リスト
     *
     * @minItems 1
     */
    location: [LocationConfig, ...LocationConfig[]];
} & DocumentConfig;
/**
 * URIパターンの定義
 * 指定がない場合、すべてのパターンにマッチします
 *
 * 1文字目で評価式が変化します
 * '=:(pattern) 完全一致
 * '~:(regex)' 正規表現
 * (なし): 前方一致
 *
 * @minItems 1
 */
export type URIConfig = [string, ...string[]];

/**
 * HTTPプロトコルバージョン設定
 */
export interface ProtocolConfig {
    http2?: boolean;
    http3?: boolean;
}

/**
 * SSL設定
 */
export interface SSLConfig {
    /**
     * 公開鍵へのファイルパス
     */
    cert_file: string;
    /**
     * 秘密鍵へのファイルパス
     */
    key_file: string;
    /**
     * HTTP > HTTPS へのリダイレクトを強制する
     */
    force_redirect?: boolean;
    hsts?: HSTSConfig;
}

/**
 * HTTP Strict Transport Security 設定
 */
export interface HSTSConfig {
    /**
     * HSTSキャッシュの有効期間。0 の場合はHSTS設定が無効になります
     */
    max?: number;
    /**
     * HSTS設定をサブドメインにも影響するかの指定
     */
    include_subdomain?: boolean;
    /**
     * HSTS設定を HTTPS Preloadリストに登録するかの指定
     */
    preload?: boolean;
}

/**
 * パス設定
 */
export interface LocationConfig {
    /**
     * ロケーション識別子
     */
    name: string;
    /**
     * ロケーション説明文
     */
    description?: string;
    uri?: URIConfig;
    cache?: CacheConfig;
}

/**
 * キャッシュ設定
 */
export interface CacheConfig {
    /**
     * キャッシュ機能の有効性
     */
    enable?: boolean;
    /**
     * キャッシュ対象とするリクエストメソッド
     */
    method?: ("HEAD" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "TRACE" | "LINK" | "UNLINK" | "OPTIONS")[];
    expire?: ExpireConfig;
    /**
     * キャッシュルール指定
     */
    rule?: {
        args?: CacheRuleConfig;
        header?: CacheRuleConfig;
        cookie?: CacheRuleConfig;
    };
}

/**
 * 有効期限設定
 */
export interface ExpireConfig {
    /**
     * 標準の有効期限
     */
    default?: number;
    /**
     * 最小有効期限
     */
    min?: number;
    /**
     * 最大有効期限
     */
    max?: number;
}

/**
 * キャッシュルール設定
 */
export interface CacheRuleConfig {
    /**
     * パラメータの扱い型設定
     *
     * 'none': パラメータを一切使用しない
     * 'all': すべてのパラメータをキャッシュパターンに使用する
     * 'include': pattern に指定したパラメータをキャッシュパターンに使用
     * 'exclude': pattern に指定していないパラメータをキャッシュパターンに使用する
     */
    type: "none" | "all" | "include" | "exclude";
    /**
     * キャッシュ作成時の振り分けを行うパターン
     */
    pattern?: string[];
    /**
     * キャッシュ機能を使用しないパラメータパターン ワイルドカードが使用可能です
     */
    bypass?: string[];
}

export interface DocumentConfig {
    /**
     * ドキュメントルートの絶対パス
     */
    root?: string;
    /**
     * アクセスログ設定
     */
    access_log?:
        | boolean
        | {
        /**
         * ログの出力先
         */
        path?: string;
        /**
         * 出力形式名
         */
        format?: string;
    };
    /**
     * エラーログの出力設定
     */
    error_log?:
        | boolean
        | {
        /**
         * エラーログの出力先
         */
        path?: string;
        /**
         * エラー出力レベル
         */
        level?: "debug" | "info" | "notice" | "warn" | "error" | "crit" | "alert" | "emerg";
    };
}
