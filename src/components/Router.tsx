import {createContext, isValidElement, useContext, useMemo, useState, Children} from 'react';
import {pathToRegexp} from 'path-to-regexp';
import type {ReactNode, Dispatch, PropsWithChildren, SetStateAction} from 'react';
import type {Key} from 'path-to-regexp';

const pathContext = createContext('/');
const dispatchContext = createContext<Dispatch<SetStateAction<string>> | undefined>(undefined);
const routeContext = createContext<string | null>(null);

const match = (path: string, pathname: string) => {
    const regexp = pathToRegexp(path);
    return regexp.test(pathname);
};

// Mock Route
export const Router = ({children}: {children: ReactNode}) => {
    const [path, setPath] = useState('/');
    return (
        <pathContext.Provider value={path}>
            <dispatchContext.Provider value={setPath}>
                {children}
            </dispatchContext.Provider>
        </pathContext.Provider>
    );
};

export const useLocation = () => {
    const path = useContext(pathContext);
    return {pathname: path};
};

export const Switch = ({children}: {children: ReactNode}) => {
    const {pathname} = useLocation();
    return (
        <>
            {
                Children.toArray(children).filter(child => {
                    if (!isValidElement(child)) {
                        return false;
                    }
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                    return match(child.props.path, pathname);
                })[0]
            }
        </>
    );
};

const useRoute = () => {
    const path = useContext(routeContext);
    // eslint-disable-next-line eqeqeq
    if (path == undefined) {
        throw new Error('must be wrapped with `Route`');
    }

    return path;
};

export const Route = ({path, children}: PropsWithChildren<{path: string}>) => {
    const regexp = pathToRegexp(path);
    const {pathname} = useLocation();
    if (!regexp.test(pathname)) {
        return null;
    }

    return <routeContext.Provider value={path}>{children}</routeContext.Provider>;
};

export const useHistory = () => {
    const dispatch = useContext(dispatchContext);
    if (!dispatch) {
        throw new Error('`useHistory` should use under `Router`');
    }
    return useMemo(() => ({push: dispatch}), [dispatch]);
};

export const useParams = <T extends Record<string, unknown> = any>(): T => {
    const path = useRoute();
    const {pathname} = useLocation();
    const keys: Key[] = [];
    const regexp = pathToRegexp(path, keys);
    const match = regexp.exec(pathname);
    if (!match) {
        return {} as T;
    }

    return keys.reduce(
        (result, {name}, index) => {
            return {
                ...result,
                [name]: match[1 + index],
            };
        },
        {} as T
    );
};
