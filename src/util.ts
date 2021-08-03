import differenceInDays from 'date-fns/differenceInDays';
import type {Stage, EbbinghausItem} from '../types/store';

export const getNextStage = (stage: Stage): Stage => {
    switch (stage) {
        case 1: return 2;
        case 2: return 4;
        case 4: return 7;
        case 7: return 15;
        default: return 1_000_000_000;
    }
};

export const isAvailable = ({updateTime, stage}: EbbinghausItem) => differenceInDays(Date.now(), updateTime) >= stage;
