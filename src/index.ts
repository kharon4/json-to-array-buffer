import {
    createUint8StringParser,
    createUint16StringParser,
    createUint32StringParser,
} from './parsers/string';
import {
    createUint8Parser,
    createInt8Parser,
    createUint16Parser,
    createInt16Parser,
    createUint32Parser,
    createInt32Parser,
    createBigUint64Parser,
    createBigInt64Parser,
    createFloat32Parser,
    createFloat64Parser,
} from './parsers/number';
import { createBoolParser } from './parsers/boolean';
import { createOrParser } from './parsers/or';
import { createObjectParser } from './parsers/object';
import { createArrayParser } from './parsers/array';
import { createTupleParser } from './parsers/tuple'
import { createConstantParser } from './parsers/constant';
import { createFixedLengthCustomParser } from './parsers/custom'

export {
    createUint8StringParser,
    createUint16StringParser,
    createUint32StringParser,
    createUint8Parser,
    createInt8Parser,
    createUint16Parser,
    createInt16Parser,
    createUint32Parser,
    createInt32Parser,
    createBigUint64Parser,
    createBigInt64Parser,
    createFloat32Parser,
    createFloat64Parser,
    createBoolParser,
    createOrParser,
    createObjectParser,
    createArrayParser,
    createTupleParser,
    createConstantParser,
    createFixedLengthCustomParser,

    // datatype versions
    createUint8StringParser as uint8String,
    createUint16StringParser as uint16String,
    createUint32StringParser as uint32String,
    createUint8StringParser as shortString,
    createUint16StringParser as string,
    createUint32StringParser as longString,

    createUint8Parser as uint8,
    createInt8Parser as int8,
    createUint16Parser as uint16,
    createInt16Parser as int16,
    createUint32Parser as uint32,
    createInt32Parser as int32,
    createInt32Parser as int,

    createBigUint64Parser as bigUint64,
    createBigUint64Parser as uint64,
    createBigInt64Parser as bigInt64,
    createBigInt64Parser as int64,

    createFloat32Parser as float32,
    createFloat32Parser as float,
    createFloat64Parser as float64,
    createFloat64Parser as double,

    createBoolParser as bool,
    createOrParser as or,
    createObjectParser as obj,
    createArrayParser as arr,
    createTupleParser as tuple,
    createConstantParser as constant,
    createFixedLengthCustomParser as custom,
};



import {type Parser} from './parsers/utils';
export type {
    Parser
};
