export type Parser <T = any>= {
    serializeInternal: (value: T, dataView: DataView, indexInBuffer: number) => number, // the final size of the total buffer
    deserializeInternal: (dataView: DataView, index: number) => ({
        v: T,
        l: number,
    }),
    serialize: (value: T, arrayBufferMaxLen?: number) => ArrayBuffer,
    deserialize: (arrayBuffer: ArrayBuffer) => T,
    identify: (value: T) => boolean, // identify if this value should be serialized by the parser or not
    calculateMinSize: () => number,
    calculateMaxSize: () => number,
}

let defaultBufferMaxSize = 10240; // 10kb

const generateDefaultBufferDataView = (maxByteLength = defaultBufferMaxSize) => {
    //@ts-ignore
    return new DataView(new ArrayBuffer(1, {maxByteLength}));
}

export const createSerializeFunction = <T>(serializeInternalFunction: Parser<T>["serializeInternal"]) => {
    return (value: T, arrayBufferMaxLen?: number) => {
        const dataView = generateDefaultBufferDataView(arrayBufferMaxLen);
        const finalSize = serializeInternalFunction(value, dataView, 0);
        //@ts-ignore
        dataView.buffer.resize(finalSize)
        return dataView.buffer;
    }
}

export const createDeserializeFunction = <T>(deserializeInternalFunction: Parser<T>["deserializeInternal"]) => {
    return (arrayBuffer: ArrayBuffer) => {
        const dataView = new DataView(arrayBuffer);
        const {v} = deserializeInternalFunction(dataView, 0);
        return v;
    }
}

type GetPrefixKeys<T> = keyof {
    [K in keyof T as K extends `get${string}` ? K : never]: K;
};

type SetPrefixKeys<T> = keyof {
    [K in keyof T as K extends `set${string}` ? K : never]: K;
};

export type DataViewSetterFunctionName = SetPrefixKeys<DataView>
export type DataViewGetterFunctionName = GetPrefixKeys<DataView>

const inserSizes: {
    [key in DataViewSetterFunctionName]: number
} = {
    setBigInt64: 8,
    setBigUint64: 8,
    setFloat32: 4,
    setFloat64: 8,
    setInt16: 2,
    setInt32: 4,
    setInt8: 1,
    setUint16: 2,
    setUint32: 4,
    setUint8: 1,
};

export const pushToDataView = (dataView: DataView, index: number, value: any, insertFunction: DataViewSetterFunctionName) => {
    const insertSize = inserSizes[insertFunction];
    const buffer = dataView.buffer;
    //@ts-ignore
    while(buffer.byteLength < index + insertSize)buffer.resize(buffer.byteLength * 2);
    dataView[insertFunction](index, value as never);
}

