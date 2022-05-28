import type {Stage} from '../../types/store';

// TODO: stage Enum
export const isFinished = (stage: Stage): boolean => stage === 1_000_000_000;
