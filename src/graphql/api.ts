import {graphql} from 'graphql';
import {resolvers} from './resolver';
import {schema} from './schema';

export const request = <T = any>(query: string, variables?: any) => {
    return graphql(schema, query, resolvers, null, variables) as Promise<T>;
};
