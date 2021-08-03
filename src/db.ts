import Dexie from 'dexie';
import {isAvailable} from './util';
import type {EbbinghausItem} from '../types/store';

const isServer = typeof window !== 'object';

class EbbinghausDatabase extends Dexie {

    readonly items: Dexie.Table<EbbinghausItem, number>;

    constructor() {
        super('EbbinghausDatabase');

        this.version(1).stores({
            items: '++id, name, link, desc, createTime, updateTime, stage',
        });

        this.items = this.table('items');
    }

    async loadAllItems(params: {variant: 'all' | 'available'} = {variant: 'all'}): Promise<EbbinghausItem[]> {
        if (isServer) {
            return [];
        }

        return this
            .items
            .filter(item => (params.variant === 'all' || isAvailable(item)))
            .toArray();
    }
}

export const db = new EbbinghausDatabase();
