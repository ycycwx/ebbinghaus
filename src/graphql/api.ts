import {graphql} from 'graphql';
import {rootValue} from './rootValue';
import {schema} from './schema';

export const request = <T = any>(source: string, variableValues?: any) => graphql({
    schema,
    source,
    rootValue,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    variableValues,
}) as Promise<T>;
