// handle boolean values

import {
    pushToDataView,
    type Parser,
    createSerializeFunction,
    createDeserializeFunction
} from "./utils";


const serializeInternal = (value, dataView, indexInBuffer) => {
    const newDataView = pushToDataView(dataView, indexInBuffer, value ? 1 : 0, 'setUint8');
    return [indexInBuffer + 1, newDataView];
};
const serialize = createSerializeFunction(serializeInternal);
const deserializeInternal = (dataView, index) => ({
    v: dataView.getUint8(index) ? true : false,
    l: 1,
});
const deserialize = createDeserializeFunction(deserializeInternal);
const identify = (value) => (typeof value === 'boolean');
const calculateMinSize = () => 1;
const calculateMaxSize = () => 1;


const BoolInternal: Parser<boolean> = {
    serialize,
    deserialize,
    serializeInternal,
    deserializeInternal,
    identify,
    calculateMaxSize,
    calculateMinSize
};


export const createBoolParser = () => BoolInternal;
