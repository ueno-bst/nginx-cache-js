import {isEmpty, isObject} from "lodash-es";
import NJSError from "~/lib/error/NJSError";
import yaml from "js-yaml";

export default <T extends object>(path: string): T => {
    const fs = require('fs');

    if (global.http_config && isObject(global.http_config)) {
        return JSON.parse(JSON.stringify(http_config)) as T;
    }

    // パスの存在確認
    if (isEmpty(path)) {
        throw new NJSError('Configuration file path not specified.');
    }

    // アクセス権のチェック
    try {
        fs.accessSync(path, fs.constants.R_OK);
    } catch {
        throw new NJSError("The config file does not exist or you do not have permissions.");
    }

    // ファイルの読み込み
    const buffer = fs.readFileSync(path, 'utf8');

    // 形式変換
    try {
        if (/\.json/i.test(path)) {
            return JSON.parse(buffer);
        }

        if (/\.ya?ml/i.test(path)) {
            return yaml.load(buffer) as T;
        }
    } catch (e) {
        throw new Error("Failed to parse configuration file : " + (e instanceof Error ? e.toString() : e));
    }

    // 形式変換失敗
    throw new Error("The configuration file is in an unsupported format.");
}
