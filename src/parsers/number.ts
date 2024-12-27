// handle all forms of numbers
import {
    pushToDataView,
    type Parser,
    createSerializeFunction,
    createDeserializeFunction,
} from "./utils";

const identify= (value) => (typeof value === 'number');

// 8 bit versions
const calculateSize8 = () => 1;

// Uint8
const serializeInternalUint8 = (value, dataView, indexInBuffer) => {
    const newDataView = pushToDataView(dataView, indexInBuffer, value, 'setUint8')
    return [indexInBuffer + 1, newDataView];
};
const serializeUint8 = createSerializeFunction(serializeInternalUint8);
const deserializeInternalUint8 = (dataView, index) => ({
    v: dataView.getUint8(index),
    l: 1,
});
const deserializeUint8 = createDeserializeFunction(deserializeInternalUint8);

const Uint8Internal: Parser<number> = {
    serialize: serializeUint8,
    deserialize: deserializeUint8,
    serializeInternal: serializeInternalUint8,
    deserializeInternal: deserializeInternalUint8,
    identify,
    calculateMaxSize: calculateSize8,
    calculateMinSize: calculateSize8
}

export const createUint8Parser = () => Uint8Internal;

// Int8
const serializeInternalInt8 = (value, dataView, indexInBuffer) => {
    const newDataView = pushToDataView(dataView, indexInBuffer, value, 'setInt8')
    return [indexInBuffer + 1, newDataView];
};
const serializeInt8 = createSerializeFunction(serializeInternalInt8);
const deserializeInternalInt8 = (dataView, index) => ({
    v: dataView.getInt8(index),
    l: 1,
});
const deserializeInt8 = createDeserializeFunction(deserializeInternalInt8);

const Int8Internal: Parser<number> = {
    serialize: serializeInt8,
    deserialize: deserializeInt8,
    serializeInternal: serializeInternalInt8,
    deserializeInternal: deserializeInternalInt8,
    identify,
    calculateMaxSize: calculateSize8,
    calculateMinSize: calculateSize8
}

export const createInt8Parser = () => Int8Internal;


// 16 bit versions
const calculateSize16 = () => 2;

// Uint16
const serializeInternalUint16 = (value, dataView, indexInBuffer) => {
    const newDataView = pushToDataView(dataView, indexInBuffer, value, 'setUint16')
    return [indexInBuffer + 2, newDataView];
};
const serializeUint16 = createSerializeFunction(serializeInternalUint16);
const deserializeInternalUint16 = (dataView, index) => ({
    v: dataView.getUint16(index),
    l: 2,
});
const deserializeUint16 = createDeserializeFunction(deserializeInternalUint16);

const Uint16Internal: Parser<number> = {
    serialize: serializeUint16,
    deserialize: deserializeUint16,
    serializeInternal: serializeInternalUint16,
    deserializeInternal: deserializeInternalUint16,
    identify,
    calculateMaxSize: calculateSize16,
    calculateMinSize: calculateSize16
}

export const createUint16Parser = () => Uint16Internal;

// Int16
const serializeInternalInt16 = (value, dataView, indexInBuffer) => {
    const newDataView = pushToDataView(dataView, indexInBuffer, value, 'setInt16')
    return [indexInBuffer + 2, newDataView];
};
const serializeInt16 = createSerializeFunction(serializeInternalInt16);
const deserializeInternalInt16 = (dataView, index) => ({
    v: dataView.getInt16(index),
    l: 2,
});
const deserializeInt16 = createDeserializeFunction(deserializeInternalInt16);

const Int16Internal: Parser<number> = {
    serialize: serializeInt16,
    deserialize: deserializeInt16,
    serializeInternal: serializeInternalInt16,
    deserializeInternal: deserializeInternalInt16,
    identify,
    calculateMaxSize: calculateSize16,
    calculateMinSize: calculateSize16
}

export const createInt16Parser = () => Int16Internal;


// 32 bit versions
const calculateSize32 = () => 4;

// Uint32
const serializeInternalUint32 = (value, dataView, indexInBuffer) => {
    const newDataView = pushToDataView(dataView, indexInBuffer, value, 'setUint32')
    return [indexInBuffer + 4, newDataView];
};
const serializeUint32 = createSerializeFunction(serializeInternalUint32);
const deserializeInternalUint32 = (dataView, index) => ({
    v: dataView.getUint32(index),
    l: 4,
});
const deserializeUint32 = createDeserializeFunction(deserializeInternalUint32);

const Uint32Internal: Parser<number> = {
    serialize: serializeUint32,
    deserialize: deserializeUint32,
    serializeInternal: serializeInternalUint32,
    deserializeInternal: deserializeInternalUint32,
    identify,
    calculateMaxSize: calculateSize32,
    calculateMinSize: calculateSize32
}

export const createUint32Parser = () => Uint32Internal;

// Int32
const serializeInternalInt32 = (value, dataView, indexInBuffer) => {
    const newDataView = pushToDataView(dataView, indexInBuffer, value, 'setInt32')
    return [indexInBuffer + 4, newDataView];
};
const serializeInt32 = createSerializeFunction(serializeInternalInt32);
const deserializeInternalInt32 = (dataView, index) => ({
    v: dataView.getInt32(index),
    l: 4,
});
const deserializeInt32 = createDeserializeFunction(deserializeInternalInt32);

const Int32Internal: Parser<number> = {
    serialize: serializeInt32,
    deserialize: deserializeInt32,
    serializeInternal: serializeInternalInt32,
    deserializeInternal: deserializeInternalInt32,
    identify,
    calculateMaxSize: calculateSize32,
    calculateMinSize: calculateSize32
}

export const createInt32Parser = () => Int32Internal;

// Float32
const serializeInternalFloat32 = (value, dataView, indexInBuffer) => {
    const newDataView = pushToDataView(dataView, indexInBuffer, value, 'setFloat32')
    return [indexInBuffer + 4, newDataView];
};
const serializeFloat32 = createSerializeFunction(serializeInternalFloat32);
const deserializeInternalFloat32 = (dataView, index) => ({
    v: dataView.getFloat32(index),
    l: 4,
});
const deserializeFloat32 = createDeserializeFunction(deserializeInternalFloat32);

const Float32Internal: Parser<number> = {
    serialize: serializeFloat32,
    deserialize: deserializeFloat32,
    serializeInternal: serializeInternalFloat32,
    deserializeInternal: deserializeInternalFloat32,
    identify,
    calculateMaxSize: calculateSize32,
    calculateMinSize: calculateSize32
}

export const createFloat32Parser = () => Float32Internal;

// 64 bit versions
const calculateSize64 = () => 8;

// BigUint64
const serializeInternalBigUint64 = (value, dataView, indexInBuffer) => {
    const newDataView = pushToDataView(dataView, indexInBuffer, value, 'setBigUint64')
    return [indexInBuffer + 8, newDataView];
};
const serializeBigUint64 = createSerializeFunction(serializeInternalBigUint64);
const deserializeInternalBigUint64 = (dataView, index) => ({
    v: dataView.getBigUint64(index),
    l: 8,
});
const deserializeBigUint64 = createDeserializeFunction(deserializeInternalBigUint64);

const BigUint64Internal: Parser<number> = {
    serialize: serializeBigUint64,
    deserialize: deserializeBigUint64,
    serializeInternal: serializeInternalBigUint64,
    deserializeInternal: deserializeInternalBigUint64,
    identify,
    calculateMaxSize: calculateSize64,
    calculateMinSize: calculateSize64
}

export const createBigUint64Parser = () => BigUint64Internal;

// BigInt64
const serializeInternalBigInt64= (value, dataView, indexInBuffer) => {
    const newDataView = pushToDataView(dataView, indexInBuffer, value, 'setBigInt64')
    return [indexInBuffer + 8, newDataView];
};
const serializeBigInt64 = createSerializeFunction(serializeInternalBigInt64);
const deserializeInternalBigInt64 = (dataView, index) => ({
    v: dataView.getBigInt64(index),
    l: 8,
});
const deserializeBigInt64 = createDeserializeFunction(deserializeInternalBigInt64);

const BigInt64Internal: Parser<number> = {
    serialize: serializeBigInt64,
    deserialize: deserializeBigInt64,
    serializeInternal: serializeInternalBigInt64,
    deserializeInternal: deserializeInternalBigInt64,
    identify,
    calculateMaxSize: calculateSize64,
    calculateMinSize: calculateSize64
}

export const createBigInt64Parser = () => BigInt64Internal;

// Float64
const serializeInternalFloat64 = (value, dataView, indexInBuffer) => {
    const newDataView = pushToDataView(dataView, indexInBuffer, value, 'setFloat64')
    return [indexInBuffer + 8, newDataView];
};
const serializeFloat64 = createSerializeFunction(serializeInternalFloat64);
const deserializeInternalFloat64 = (dataView, index) => ({
    v: dataView.getFloat64(index),
    l: 8,
});
const deserializeFloat64 = createDeserializeFunction(deserializeInternalFloat64);

const Float64Internal: Parser<number> = {
    serialize: serializeFloat64,
    deserialize: deserializeFloat64,
    serializeInternal: serializeInternalFloat64,
    deserializeInternal: deserializeInternalFloat64,
    identify,
    calculateMaxSize: calculateSize64,
    calculateMinSize: calculateSize64
}

export const createFloat64Parser = () => Float64Internal;


