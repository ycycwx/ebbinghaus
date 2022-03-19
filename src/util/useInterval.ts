import {useEffect, useRef, useState} from 'react';

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

export const useIntervalToken = (delay: number | null) => {
    const [token, setToken] = useState(0);
    useInterval(() => setToken(token => token + 1), delay);
    return token;
};
