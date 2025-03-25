import {lazy, memo, StrictMode, Suspense} from 'react';
import {
    Center,
    ChakraProvider,
    HStack,
} from '@chakra-ui/react';
import {Locales} from '../locales';
import {theme} from '../theme';
import {Router} from './Router';
import {Title} from './Title';
import type {LocalesContext} from '../locales';

const Main = lazy(() => import('./Main').then(module => ({default: module.Main})));

const Fallback = () => {
    return (
        <HStack as={Center} spacing={3} p={6}>
            <Title isOpen={false} />
        </HStack>
    );
};

export const App = memo<{locales: LocalesContext}>(({locales}) => (
    <StrictMode>
        <Locales value={locales}>
            <ChakraProvider theme={theme}>
                <Router>
                    <Suspense fallback={<Fallback />}>
                        <Main />
                    </Suspense>
                </Router>
            </ChakraProvider>
        </Locales>
    </StrictMode>
));
