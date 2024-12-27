// handle objects with known keys
import {
    createDeserializeFunction,
    createSerializeFunction,
    type Parser,
} from "./utils";

export const createObjectParser = <T extends {[key: string]: Parser}>(object: T, identify?: ((value: any) => boolean)) => {
    let max = 0;
    let min = 0;

    const keys = Object.keys(object).sort();

    keys.forEach(key => {
        const parser = object[key];
        max += parser.calculateMaxSize();
        min += parser.calculateMinSize();
    });

    const serializeInternal = (value, dataView, indexInBuffer) => {
        let nextIndex = indexInBuffer;
        let newDataView = dataView;
        keys.forEach(key => {
            const [_nextIndex, _nextDataView] = object[key].serializeInternal(value[key], newDataView, nextIndex);
            nextIndex = _nextIndex;
            newDataView = _nextDataView;
        })
        return [nextIndex, newDataView];
    };
    const serialize = createSerializeFunction(serializeInternal);
    const deserializeInternal = (dataView, index) => {
        const value = {};
        let length = 0;
        keys.forEach(key => {
            const {v, l} = object[key].deserializeInternal(dataView, index + length);
            value[key] = v;
            length += l;
        })
        return {
            v: value,
            l: length,
        }
    };
    const deserialize = createDeserializeFunction(deserializeInternal);
    const _identify = identify || ((v) => {
        if(typeof v !== 'object')return false;
        for(let i = 0 ; i < keys.length; ++i){
            const key = keys[i];
            if(!object[key].identify(v[key]))return false;
        }
        return true;
    });
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
