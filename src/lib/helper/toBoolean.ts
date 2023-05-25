import {isBoolean, isEmpty, isNil, isNumber} from "lodash-es";

export default function (value: any, def: boolean = false): boolean {
    if (isNil(value)) {
        return def;
    }

    if (isNumber(value)) {
        return value !== 0;
    }

    if (isBoolean(value)) {
        return value;
    }

    if (isEmpty(value)) {
        return def;
    }

    return true;
}
