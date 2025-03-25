import {createContext, isValidElement, useContext, useMemo, useState, Children} from 'react';
import {match, pathToRegexp} from 'path-to-regexp';
import type {ReactNode, Dispatch, PropsWithChildren, SetStateAction} from 'react';

const pathContext = createContext('/');
const dispatchContext = createContext<Dispatch<SetStateAction<string>> | undefined>(undefined);
const routeContext = createContext<string | null>(null);

// Mock Route
export const Router = ({children}: {children: ReactNode}) => {
    const [path, setPath] = useState('/');
    return (
        <pathContext.Provider value={path}>
            <dispatchContext.Provider value={setPath}>{children}</dispatchContext.Provider>
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
                // TODO: `Children` is marked as deprecated.
                Children.toArray(children).find(child => {
                    if (!isValidElement(child)) {
                        return false;
                    }

                    // TODO: fix any issue
                    // eslint-disable-next-line @stylistic/max-len
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                    return match((child.props as any).path)(pathname);
                })
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
    const {regexp} = pathToRegexp(path);
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

export const useParams = () => {
    const path = useRoute();
    const {pathname} = useLocation();
    const fn = match(path);
    const matches = fn(pathname);
    if (!matches) {
        return {};
    }

    return matches.params;
};
