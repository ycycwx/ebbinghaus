import {useLiveQuery} from 'dexie-react-hooks';
import {useIntervalToken} from '../util';
import {db} from './db';

type Variant = NonNullable<Parameters<typeof db.loadAllItems>[0]>['variant'];
export const useItems = (
    {variant, polling}: {variant: Variant, polling: number | null} = {variant: 'all', polling: null}
) => {
    const token = useIntervalToken(polling);
    return useLiveQuery(() => db.loadAllItems({variant}), [variant, token]);
};

export const useItem = (id: number) => {
    return useLiveQuery(() => db.getItem(id), [id]);
};
