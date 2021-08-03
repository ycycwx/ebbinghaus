import {createContext, useContext} from 'react';

const context = createContext<null | ((...args: any[]) => Promise<any>)>(null);

export const Mutate = context.Provider;

export const useMutate = () => {
    const mutate = useContext(context);
    if (!mutate) {
        throw new Error('`useMutate` must be used with Mutate');
    }
    return mutate;
};
