import {useEffect, useReducer, useRef} from 'react';
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

export const useForceUpdate = () => {
    const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
    return forceUpdate;
};

export const useInterval = (callback: () => void, delay: number | null) => {
    const savedCallback = useRef(callback);

    useEffect(
        () => {
            savedCallback.current = callback;
        },
        [callback]
    );

    useEffect(
        () => {
            if (delay === null) {
                return;
            }

            const id = setInterval(() => savedCallback.current(), delay);
            // eslint-disable-next-line consistent-return
            return () => clearInterval(id);
        },
        [delay]
    );
};
