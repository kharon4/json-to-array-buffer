import { _16bitRange, _32bitRange, _8bitRange } from "../constants";
import {
    type DataViewGetterFunctionName,
    type DataViewSetterFunctionName,
    type Parser,
    pushToDataView,
    createSerializeFunction,
    createDeserializeFunction,
} from "./utils"

type SupportedTypes = undefined | null | boolean | number | string | Parser

type UnionOfTypes<Types extends SupportedTypes[]> = {
    [P in keyof Types]: Types[P] extends Parser ? ReturnType<Types[P]["deserializeInternal"]>["v"] : Types[P];
}[keyof Types];

export const createOrParser = <T extends SupportedTypes[]>(...values: T) => {
    const numberOfPossibilities = values.length;
    if(numberOfPossibilities < 2)console.warn(`Serialization of less than 2 posibilities is serializing structural information. This is discouraged.`)
    
    let getOprationName: DataViewGetterFunctionName = 'getUint32';
    let setOprationName: DataViewSetterFunctionName = 'setUint32';
    let bytesForPossibilities = 4;
    if(numberOfPossibilities <= _16bitRange){
        getOprationName = 'getUint16';
        setOprationName = 'setUint16';
        bytesForPossibilities = 2;
    }
    if(numberOfPossibilities <= _8bitRange){
        getOprationName = 'getUint8';
        setOprationName = 'setUint8';
        bytesForPossibilities = 1;
    }

    // value to index map or identification callback array
    const identificationArray = [] as ((v: any) => number)[];
    const valueToIndexMap = new Map;
    let min = values.length ? Number.MAX_SAFE_INTEGER: 0;
    let max = 0;
    values.forEach((value, index) => {
        const valueType = typeof value;
        if(
            valueType === 'undefined' ||
            valueType === 'boolean' ||
            valueType === 'number' ||
            valueType === 'string' ||
            value === null
        ){
            valueToIndexMap.set(value, index);
            min = 0;
        }else{
            identificationArray.push((v) => {
                if((value as Parser).identify(v)) return index;
                return -1;
            })
            max = Math.max(max, (value as Parser).calculateMaxSize());
            min = Math.min(min, (value as Parser).calculateMinSize())
        }
    })

    min += bytesForPossibilities;
    max += bytesForPossibilities;

    const serializeInternal = (value, dataView, indexInBuffer) => {
        let index = valueToIndexMap.get(value);
        let moreDataNeeded = false;
        if(index === undefined){
            moreDataNeeded = true;
            identificationArray.find(fn => {
                const foundIndex = fn(value);
                if(foundIndex < 0)return false;
                index = foundIndex;
                return true;
            })
            if(index === undefined){
                throw `could not serialize ${value}, no parser found`;
            }
        }
        let newDataView = pushToDataView(dataView, indexInBuffer, index, setOprationName);
        const [nextIndex, nextDataView] = moreDataNeeded ? 
            (values[index] as Parser).serializeInternal(value, newDataView, indexInBuffer + bytesForPossibilities) :
            [indexInBuffer + bytesForPossibilities, newDataView];
        return [nextIndex, nextDataView];
    };
    const serialize = createSerializeFunction(serializeInternal);
    const deserializeInternal = (dataView, index) => {
        const valueTypeIndex = dataView[getOprationName](index) as number;
        const valueType = values[valueTypeIndex];
        if(typeof valueType === 'object'){
            const {v, l} = (valueType as Parser).deserializeInternal(dataView, index + bytesForPossibilities);
            return {
                v,
                l: l + bytesForPossibilities,
            };
        }else {
            return {
                v: valueType,
                l: bytesForPossibilities,
            }
        }
    };
    const deserialize = createDeserializeFunction(deserializeInternal);
    const identify = (value) => {
        let index = valueToIndexMap.get(value);
        if(index !== undefined)return true;
        for(let i = 0 ; i < identificationArray.length; ++i){
            if(identificationArray[i](value) >= 0)return true;
        }
        return false;
    };
    const calculateMinSize = () => min;
    const calculateMaxSize = () => max;

    const returnVal = {
      serialize,
      deserialize,
      serializeInternal,
      deserializeInternal,
      identify,
      calculateMaxSize,
      calculateMinSize,  
    } as Parser<UnionOfTypes<T>>;

    return returnVal;
}