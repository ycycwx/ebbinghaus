import {GraphQLScalarType} from 'graphql';
import {db} from '../db';
import type {EbbinghausItem} from '../../types/store';

const dateScalar = new GraphQLScalarType<Date, string>({
    name: 'Date',
    parseValue(value: unknown) {
        return new Date(value as string);
    },
    serialize(value: unknown) {
        return (value as Date).toISOString();
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

export const rootValue = {
    dateScalar,
    voidScalar,
    item: ({id}: {id: string}) => db.getItem(+id),
    items: ({variant}: {variant: 'all' | 'available'}) => db.loadAllItems({variant}),
    addItem: ({name, link, desc}: EbbinghausItem) => db.addItem({name, link, desc}),
    updateStage: ({id}: {id: string}) => db.updateStage(+id),
    updateUpdateTime: ({id}: {id: string}) => db.updateUpdateTime(+id),
    updateItem: ({id, ...item}: {id: string, name?: string, link?: string, desc?: string}) => db.updateItem(+id, item),
    deleteItem: ({id}: {id: string}) => db.deleteItem(+id),
    resetItem: ({id}: {id: string}) => db.resetItem(+id),
};
