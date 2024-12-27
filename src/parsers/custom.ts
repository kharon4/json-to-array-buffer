// handle custom values

import { _16bitRange, _8bitRange } from "../constants";
import {
    pushToDataView,
    type Parser,
    createSerializeFunction,
    createDeserializeFunction,
    DataViewGetterFunctionName,
    DataViewSetterFunctionName
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
        let newDataView = dataView;
        for(let i = 0 ; i < bufferLen; ++i)newDataView = pushToDataView(newDataView, indexInBuffer + i, buffer[i], 'setUint8');
        return [indexInBuffer + bufferLen, newDataView];
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


export const createDynamicLengthCustomParser = <T>(
    serializer: (value: T) => Uint8Array,
    deserializer: (buffer: Uint8Array) => T,
    maxBufferLen: number = Number.MAX_SAFE_INTEGER,
    identify: (value: any) => boolean = noMatch,
) => {
    let getOprationName: DataViewGetterFunctionName = 'getUint32';
    let setOprationName: DataViewSetterFunctionName = 'setUint32';
    let bytesForLen = 4;
    if(maxBufferLen < _16bitRange){
        getOprationName = 'getUint16';
        setOprationName = 'setUint16';
        bytesForLen = 2;
    }
    if(maxBufferLen < _8bitRange){
        getOprationName = 'getUint8';
        setOprationName = 'setUint8';
        bytesForLen = 1;
    }

    const serializeInternal = (value, dataView, indexInBuffer) => {
        const buffer = serializer(value);
        let newDataView = pushToDataView(dataView, indexInBuffer, buffer.byteLength, setOprationName);
        for(let i = 0 ; i < buffer.byteLength; ++i)newDataView = pushToDataView(newDataView, indexInBuffer + i + bytesForLen, buffer[i], 'setUint8');
        return [indexInBuffer + buffer.byteLength + bytesForLen, newDataView];
    };
    const serialize = createSerializeFunction(serializeInternal);
    const deserializeInternal = (dataView, index) => {
        const len = dataView[getOprationName](index);
        return ({
            v: deserializer(new Uint8Array(dataView.buffer, index + bytesForLen, len)),
            l: len + bytesForLen,
        })
    };
    const deserialize = createDeserializeFunction(deserializeInternal);

    return {
        serialize,
        serializeInternal,
        deserialize,
        deserializeInternal,
        identify,
        calculateMaxSize: () => bytesForLen,
        calculateMinSize: () => bytesForLen + maxBufferLen,
    } as Parser<T>;
};
