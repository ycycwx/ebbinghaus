import {useInterval} from '@chakra-ui/react';
import {useState} from 'react';

export const useIntervalToken = (delay: number | null) => {
    const [token, setToken] = useState(0);
    useInterval(
        () => {
            setToken(token => token + 1);
        },
        delay
    );
    return token;
};
