// handle objects with known keys
import {
    createDeserializeFunction,
    createSerializeFunction,
    type Parser,
} from "./utils";

const defaultObjectIdentifier = ((value) => typeof value === 'object')

export const createObjectParser = <T extends {[key: string]: Parser}>(object: T, identify: ((value: any) => boolean) = defaultObjectIdentifier) => {
    let max = 0;
    let min = 0;

    const keys = Object.keys(object).sort();

    keys.forEach(key => {
        const parser = object[key];
        max += parser.calculateMaxSize();
        min += parser.calculateMinSize();
    });

    const serializeInternal = (value, dataView, indexInBuffer) => {
        let nextIndex = indexInBuffer;
        keys.forEach(key => {
            const _nextIndex = object[key].serializeInternal(value[key], dataView, nextIndex);
            nextIndex = _nextIndex;
        })
        return nextIndex;
    };
    const serialize = createSerializeFunction(serializeInternal);
    const deserializeInternal = (dataView, index) => {
        const value = {};
        let length = 0;
        keys.forEach(key => {
            const {v, l} = object[key].deserializeInternal(dataView, index + length);
            value[key] = v;
            length += l;
        })
        return {
            v: value,
            l: length,
        }
    };
    const deserialize = createDeserializeFunction(deserializeInternal);
    const calculateMinSize = () => min;
    const calculateMaxSize = () => max;

    const rVal = ({
        serialize,
        deserialize,
        serializeInternal,
        deserializeInternal,
        identify,
        calculateMaxSize,
        calculateMinSize,
    } as Parser<{[key in keyof T]: ReturnType<T[key]["deserializeInternal"]>["v"]}>);

    return rVal;
}
