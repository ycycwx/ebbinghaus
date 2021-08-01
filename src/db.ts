import Dexie from 'dexie';
import differenceInDays from 'date-fns/differenceInDays';
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

    async loadAvailableItems(): Promise<EbbinghausItem[]> {
        if (isServer) {
            return [];
        }

        return this
            .items
            .filter(({updateTime, stage}) => differenceInDays(Date.now(), updateTime) > stage)
            .toArray();
    }

    async loadAllItems(): Promise<EbbinghausItem[]> {
        if (isServer) {
            return [];
        }

        return this
            .items
            .toArray();
    }
}

export const db = new EbbinghausDatabase();
