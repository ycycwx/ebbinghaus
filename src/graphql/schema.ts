import {buildSchema} from 'graphql';

export const schema = buildSchema(`
    scalar Date
    scalar Void

    type Item {
        id: ID!
        name: String!
        link: String
        desc: String
        createTime: Date!
        updateTime: Date!
        stage: Int
    }

    type Query {
        items(variant: String!): [Item]
        item(id: ID!): Item
    }

    type Mutation {
        addItem(name: String!, link: String, desc: String): Void
        updateItem(id: ID!): Void
        deleteItem(id: ID!): Void
    }
`);
