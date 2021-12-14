import {createContext, useContext} from 'react';
import type {useDisclosure} from '@chakra-ui/react';

const CheckedContext = createContext<null | ReturnType<typeof useDisclosure>>(null);

export const Checked = CheckedContext.Provider;

export const useChecked = () => {
    const disclosure = useContext(CheckedContext);
    if (!disclosure) {
        throw new Error('useChecked must be used within a Checked');
    }
    return disclosure;
};
