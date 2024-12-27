// handle all forms of strings

import {
    _16bitRange,
    _32bitRange,
    _8bitRange
} from '../constants';
import {
    pushToDataView,
    type Parser,
    createSerializeFunction,
    createDeserializeFunction
} from './utils';

const textEncoder = new TextEncoder();

if(textEncoder.encoding !== 'utf-8'){
    textEncoder.encode = (value: string) => {
        throw `Cannot encode the encoding for textEncoder is ${textEncoder.encoding} which is not supported`;
    }
}

const textDecoder = (new TextDecoder('utf-8'));

const identify = (value) => (typeof value === 'string');

// Uint8String
const serializeInternalUint8 = (value, dataView, indexInBuffer) => {
    const buffer = textEncoder.encode(value);
    if(buffer.byteLength > _8bitRange - 1)
        throw `can not serialize the string: ${JSON.stringify(value)}, which has a utf-8 encoding length of ${buffer.byteLength} as a Uint8String.`
    let newDataView = pushToDataView(dataView, indexInBuffer, buffer.byteLength, 'setUint8');
    for(let i = 0 ; i < buffer.byteLength; ++i)newDataView = pushToDataView(newDataView, indexInBuffer + i + 1, buffer[i], 'setUint8');
    return [indexInBuffer + 1 + buffer.byteLength, newDataView];
};
const serializeUint8 = createSerializeFunction(serializeInternalUint8);
const deserializeInternalUint8 = (dataView, index) => {
    const len = dataView.getUint8(index);
    const v = textDecoder.decode(new Uint8Array(dataView.buffer, index+1, len));
    return {
        v,
        l: len + 1
    }
};
const deserializeUint8 = createDeserializeFunction(deserializeInternalUint8);

const Uint8StringInternal: Parser<string> = {
    serialize: serializeUint8,
    deserialize: deserializeUint8,
    serializeInternal: serializeInternalUint8,
    deserializeInternal: deserializeInternalUint8,
    identify,
    calculateMaxSize: () => _8bitRange,
    calculateMinSize: () => 1,
}

// max of 256 - 1 bytes in utf-8 encoding
export const createUint8StringParser = () => Uint8StringInternal;


// Uint16String
const serializeInternalUint16 = (value, dataView, indexInBuffer) => {
    const buffer = textEncoder.encode(value);
    if(buffer.byteLength > _16bitRange - 2)
        throw `can not serialize the string: ${JSON.stringify(value)}, which has a utf-8 encoding length of ${buffer.byteLength} as a Uint16String.`
    let newDataView = pushToDataView(dataView, indexInBuffer, buffer.byteLength, 'setUint16');
    for(let i = 0 ; i < buffer.byteLength; ++i)newDataView = pushToDataView(newDataView, indexInBuffer + i + 2, buffer[i], 'setUint8');
    return [indexInBuffer + 2 + buffer.byteLength, newDataView];
};
const serializeUint16 = createSerializeFunction(serializeInternalUint16);
const deserializeInternalUint16 = (dataView, index) => {
    const len = dataView.getUint16(index);
    const v = textDecoder.decode(new Uint8Array(dataView.buffer, index+2, len));
    return {
        v,
        l: len + 2
    }
};
const deserializeUint16 = createDeserializeFunction(deserializeInternalUint16);

const Uint16StringInternal: Parser<string> = {
    serialize: serializeUint16,
    deserialize: deserializeUint16,
    serializeInternal: serializeInternalUint16,
    deserializeInternal: deserializeInternalUint16,
    identify,
    calculateMaxSize: () => _16bitRange,
    calculateMinSize: () => 1,
}

// max of 256 * 256 - 2 = 65,534 bytes in utf-8 encoding
export const createUint16StringParser = () => Uint16StringInternal;

// Uint32String
const serializeInternalUint32 = (value, dataView, indexInBuffer) => {
    const buffer = textEncoder.encode(value);
    if(buffer.byteLength > _32bitRange - 4)
        throw `can not serialize the string: ${JSON.stringify(value)}, which has a utf-8 encoding length of ${buffer.byteLength} as a Uint32String.`
    let newDataView = pushToDataView(dataView, indexInBuffer, buffer.byteLength, 'setUint32');
    for(let i = 0 ; i < buffer.byteLength; ++i)newDataView = pushToDataView(newDataView, indexInBuffer + i + 4, buffer[i], 'setUint8');
    return [indexInBuffer + 4 + buffer.byteLength, newDataView];
};
const serializeUint32 = createSerializeFunction(serializeInternalUint32);
const deserializeInternalUint32 = (dataView, index) => {
    const len = dataView.getUint32(index);
    const v = textDecoder.decode(new Uint8Array(dataView.buffer, index+2, len));
    return {
        v,
        l: len + 4
    }
};
const deserializeUint32 = createDeserializeFunction(deserializeInternalUint32);

const Uint32StringInternal: Parser<string> = {
    serialize: serializeUint32,
    deserialize: deserializeUint32,
    serializeInternal: serializeInternalUint32,
    deserializeInternal: deserializeInternalUint32,
    identify,
    calculateMaxSize: () => _32bitRange,
    calculateMinSize: () => 1,
}

// max of 256 * 256 * 256 - 4 = 1,67,77,212 bytes in utf-8 encoding
export const createUint32StringParser = () => Uint32StringInternal;
