// handle custom values

import {
    pushToDataView,
    type Parser,
    createSerializeFunction,
    createDeserializeFunction
} from "./utils";

const noMatch = () => false;

export const createFixedLengthCustomParser = <T>(
    bufferLen: number,
    serializer: (value: T) => Uint8Array,
    deserializer: (buffer: Uint8Array) => T,
    identify: (value: any) => boolean = noMatch,
) => {
    const serializeInternal = (value, dataView, indexInBuffer) => {
        const buffer = serializer(value);
        for(let i = 0 ; i < bufferLen; ++i)pushToDataView(dataView, indexInBuffer + i, buffer[i], 'setUint8');
        return indexInBuffer + bufferLen;
    };
    const serialize = createSerializeFunction(serializeInternal);
    const deserializeInternal = (dataView, index) => ({
        v: deserializer(new Uint8Array(dataView.buffer, index, bufferLen)),
        l: bufferLen,
    });
    const deserialize = createDeserializeFunction(deserializeInternal);
    const calcSize = () => bufferLen;


    return {
        serialize,
        serializeInternal,
        deserialize,
        deserializeInternal,
        identify,
        calculateMaxSize: calcSize,
        calculateMinSize: calcSize,
    } as Parser<T>;
};
