import {
    _8bitRange,
    _16bitRange
} from '../constants';
import {
    pushToDataView,
    type DataViewGetterFunctionName,
    type DataViewSetterFunctionName,
    type Parser,
    createSerializeFunction,
    createDeserializeFunction,
} from './utils';

export const createArrayParser = <T extends Parser>(parser: T, maxLen = Number.MAX_SAFE_INTEGER, identify?: ((value: any) => boolean)) => {
    
    let getOprationName: DataViewGetterFunctionName = 'getUint32';
    let setOprationName: DataViewSetterFunctionName = 'setUint32';
    let bytesForLen = 4;
    if(maxLen < _16bitRange){
        getOprationName = 'getUint16';
        setOprationName = 'setUint16';
        bytesForLen = 2;
    }
    if(maxLen < _8bitRange){
        getOprationName = 'getUint8';
        setOprationName = 'setUint8';
        bytesForLen = 1;
    }

    const max = parser.calculateMaxSize() * maxLen;

    // functions
    const serializeInternal = (value, dataView, indexInBuffer) => {
        let newDataView = pushToDataView(dataView, indexInBuffer, value.length, setOprationName);
        let nextIndex = indexInBuffer + bytesForLen;
        value.forEach(element => {
            const [_nextIndex, nextDataView] = parser.serializeInternal(element, newDataView, nextIndex);
            newDataView = nextDataView;
            nextIndex = _nextIndex;
        })
        return [nextIndex, newDataView];
    };
    const serialize = createSerializeFunction(serializeInternal);
    const deserializeInternal = (dataView, index) => {
        const len = dataView[getOprationName](index) as number;
        const value = [] as ReturnType<T["deserializeInternal"]>["v"][];
        value.length = len;
        let position = index + bytesForLen;
        for(let i = 0 ; i < len; ++i){
            const {v,l} = parser.deserializeInternal(dataView, position);
            value[i] = v;
            position += l;
        }

        return {
            v: value,
            l: position - index,
        }
    };
    const deserialize = createDeserializeFunction(deserializeInternal);
    const _identify = identify || ((value) => {
        if(!Array.isArray(value))return false;
        if(value.length > maxLen)return false;
        for(let i = 0 ; i < value.length; ++i)if(!parser.identify(value[i]))return false;
        return true;
    })
    const calculateMinSize = () => bytesForLen;
    const calculateMaxSize = () => max;

    const rVal: Parser<ReturnType<T["deserializeInternal"]>["v"][]> = ({
        serialize,
        deserialize,
        serializeInternal,
        deserializeInternal,
        identify: _identify,
        calculateMaxSize,
        calculateMinSize,
    })

    return rVal;
};
