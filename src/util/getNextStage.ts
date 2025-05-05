import type {Stage} from '../../types/store';

export const getNextStage = (stage: Stage): Stage => {
    switch (stage) {
        case 1: return 2;
        case 2: return 4;
        case 4: return 7;
        case 7: return 15;
        case 15: return 28;
        case 28: return 60;
        case 60: return 90;
        case 90: return 180;
        case 180: return 365;
        default: return 1_000_000_000;
    }
};
