// handle tuples (arrays with known size and types)
import {
    createDeserializeFunction,
    createSerializeFunction,
    type Parser,
} from "./utils";

export const createTupleParser = <T extends Parser[]>(parsers: T, identify?: (value: any) => boolean) => {
    let max = 0;
    let min = 0;

    parsers.forEach(parser => {
        max += parser.calculateMaxSize();
        min += parser.calculateMinSize();
    });
    const _identify = identify || ((value) => {
        if(!Array.isArray(value) || value.length!==parsers.length)return false;
        for(let i = 0 ; i < value.length; ++i)if(!parsers[i].identify(value[i]))return false;
        return true;
    })
    const serializeInternal = (value, dataView, indexInBuffer) => {
        let nextIndex = indexInBuffer;
        parsers.forEach((parser, index) => {
            const _nextIndex = parser.serializeInternal(value[index], dataView, nextIndex);
            nextIndex = _nextIndex;
        })
        return nextIndex;
    };
    const serialize = createSerializeFunction(serializeInternal);
    const deserializeInternal = (dataView, index) => {
        const value = [] as { [I in keyof T]: ReturnType<T[I]['deserialize']> };
        value.length = parsers.length;
        let length = 0;
        parsers.forEach((parser, tupeLindex) => {
            const {v, l} = parser.deserializeInternal(dataView, index + length);
            value[tupeLindex] = v;
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
        identify: _identify,
        calculateMaxSize,
        calculateMinSize,
    } as Parser<{[key in keyof T]: ReturnType<T[key]["deserializeInternal"]>["v"]}>);

    return rVal;
}