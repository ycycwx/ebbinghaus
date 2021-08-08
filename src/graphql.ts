import {buildSchema, graphql, GraphQLScalarType} from 'graphql';
import {db} from './db';

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
        return new Date(value);
    },
    serialize(value) {
        return value.toISOString();
    },
});

const voidScalar = new GraphQLScalarType({
    name: 'Void',
    serialize() {
        return null;
    },
    parseValue() {
        return null;
    },
    parseLiteral() {
        return null;
    },
});

const schema = buildSchema(`
    scalar Date
    scalar Void

    type Item {
        id: ID!
        name: String!
        link: String
        desc: String
        createTime: Date
        updateTime: Date
        stage: Int
    }

    type Query {
        items(variant: String!): [Item]
        item(id: ID!): Item
    }

    type Mutation {
        updateItem(id: ID!): Void
        deleteItem(id: ID!): Void
    }
`);

const root = {
    dateScalar,
    voidScalar,
    item: ({id}: {id: string}) => db.getItem(+id),
    items: ({variant}: {variant: 'all' | 'available'}) => db.loadAllItems({variant}),
    updateItem: ({id}: {id: string}) => db.updateItem(+id),
    deleteItem: ({id}: {id: string}) => db.deleteItem(+id),
};

export const request = <T = any>(query: string, variables?: any) =>
    graphql(schema, query, root, null, variables) as Promise<T>;
