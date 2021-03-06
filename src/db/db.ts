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

        return this
            .items
            .filter(item => (params.variant === 'all' || isAvailable(item)))
            .toArray();
    }

    async addItem(item: Pick<EbbinghausItem, 'name' | 'link' | 'desc'>): Promise<void | number> {
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

    async getItem(id: number): Promise<EbbinghausItem | undefined> {
        if (isServer) {
            return;
        }

        return this.items.get({id});
    }

    async updateStage(id: number): Promise<void> {
        if (isServer) {
            return;
        }

        const item = await this.getItem(id);
        if (!item) {
            throw new Error('item should be update with `id`');
        }

        return this.items.update(id, {updateTime: Date.now(), stage: getNextStage(item.stage)}) as unknown as void;
    }

    async updateUpdateTime(id: number): Promise<void> {
        if (isServer) {
            return;
        }

        const item = await this.getItem(id);
        if (!item) {
            throw new Error('item should be update with `id`');
        }

        return this.items.update(id, {updateTime: Date.now()}) as unknown as void;
    }

    async updateItem(id: number, partialItem: Partial<EbbinghausItem>): Promise<void> {
        if (isServer) {
            return;
        }

        return this.items.update(id, {...(await this.getItem(id)), ...partialItem}) as unknown as void;
    }

    async deleteItem(id: number): Promise<void | number> {
        if (isServer) {
            return;
        }

        return this.items.delete(id);
    }
}

export const db = new EbbinghausDatabase();
