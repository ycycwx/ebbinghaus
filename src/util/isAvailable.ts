import differenceInDays from 'date-fns/differenceInDays/index.js';
import type {EbbinghausItem} from '../../types/store';

export const isAvailable = ({updateTime, stage}: EbbinghausItem) => differenceInDays(Date.now(), updateTime) >= stage;
