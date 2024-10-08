import {Dexie} from 'dexie';
import {getNextStage, isAvailable} from '../util';
import type {Table} from 'dexie';
import type {EbbinghausItem} from '../../types/store';

const isServer = typeof window !== 'object';

class EbbinghausDatabase extends Dexie {
    readonly items: Table<EbbinghausItem, number>;

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

        return this.items.filter(item => params.variant === 'all' || isAvailable(item)).toArray();
    }

    async addItem(item: Pick<EbbinghausItem, 'name' | 'link' | 'desc'>) {
        if (isServer) {
            return;
        }

        const time = Date.now();

        return this.items.add({
            ...item,
            createTime: time,
            updateTime: time,
            stage: 1,
        });
    }

    async getItem(id: number) {
        if (isServer) {
            return;
        }

        return this.items.get({id});
    }

    async updateStage(id: number) {
        if (isServer) {
            return;
        }

        const item = await this.getItem(id);
        if (!item) {
            throw new Error('item should be update with `id`');
        }

        return this.items.update(id, {updateTime: Date.now(), stage: getNextStage(item.stage)});
    }

    async updateUpdateTime(id: number) {
        if (isServer) {
            return;
        }

        const item = await this.getItem(id);
        if (!item) {
            throw new Error('item should be update with `id`');
        }

        return this.items.update(id, {updateTime: Date.now()});
    }

    async updateItem(id: number, partialItem: Partial<EbbinghausItem>) {
        if (isServer) {
            return;
        }

        return this.items.update(id, {...(await this.getItem(id)), ...partialItem});
    }

    async deleteItem(id: number) {
        if (isServer) {
            return;
        }

        return this.items.delete(id);
    }

    async resetItem(id: number) {
        if (isServer) {
            return;
        }

        const item = await this.getItem(id);
        if (!item) {
            return;
        }

        const now = Date.now();
        return this.items.update(id, {
            ...item,
            createTime: now,
            updateTime: now,
            stage: 1,
        });
    }
}

export const db = new EbbinghausDatabase();
