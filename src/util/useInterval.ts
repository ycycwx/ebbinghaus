import {useEffect, useRef} from 'react';

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
