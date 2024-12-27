// handle constant values

import {
    createDeserializeFunction,
    createSerializeFunction,
    type Parser
} from "./utils";


const calculateSize = () => 0;

export const createConstantParser = <T>(constant: T, identify?: (value: any) => boolean) => {
    const serializeInternal = (_value, dataView, indexInBuffer) => [indexInBuffer, dataView];
    const serialize = createSerializeFunction(serializeInternal);
    const deserializeInternal = (_dataView, _index) => ({
        v: constant,
        l: 0,
    });
    const deserialize = createDeserializeFunction(deserializeInternal);

    return ({
        serialize,
        deserialize,
        serializeInternal,
        deserializeInternal,
        identify: identify || ((value) => (value === constant)),
        calculateMinSize: calculateSize,
        calculateMaxSize: calculateSize,
    } as Parser<T>)
};
