import {graphql} from 'graphql';
import {rootValue} from './rootValue';
import {schema} from './schema';

export const request = async <T = any>(source: string, variableValues?: any) => graphql({
    schema,
    source,
    rootValue,
    variableValues,
}) as Promise<T>;
