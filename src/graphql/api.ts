import {graphql} from 'graphql';
import {rootValue} from './rootValue';
import {schema} from './schema';
import type {GraphQLArgs} from 'graphql';

export const request = (source: GraphQLArgs['source'], variableValues: GraphQLArgs['variableValues']) => graphql({
    schema,
    source,
    rootValue,
    variableValues,
});
