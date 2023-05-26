import {isBoolean, isEmpty, isNil, isNumber, isString} from "lodash-es";

/**
 * 値を boolean 値に変換して返却
 * @param value 検証する値
 * @param def 検証値が未確定の場合に返却するデフォルト値
 */
export default function (value: any, def: boolean = false): boolean {
    // bool型の場合はそのまま返す
    if (isBoolean(value)) {
        return value;
    }

    // 文字形式の場合
    if (isString(value)) {
        // 空文字, no, 0, off, false 以外は true と判定する
        return !(value === '' || ['no', '0', 'off', 'false'].indexOf(value) >= 0);
    }

    // 数字の場合
    if (isNumber(value)) {
        // 0 以外は true と判定する
        return value !== 0;
    }

    // undefined, null 形式の場合、デフォルト値を返却する
    if (isNil(value)) {
        return def;
    }

    // その他の場合はLodash.isEmpty に任せる
    return !isEmpty(value);
}
