import {lazy, memo, StrictMode, Suspense} from 'react';
import {
    Center,
    ChakraProvider,
    HStack,
    Heading,
    IconButton,
    Switch,
    extendTheme,
    withDefaultVariant,
    withDefaultColorScheme,
    withDefaultSize,
} from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons';
import {Locales} from '../locales';
import {Router} from './Router';
import type {LocalesContext} from '../locales';

const theme = extendTheme(
    withDefaultVariant({variant: 'outline'}),
    withDefaultSize({size: 'sm'}),
    withDefaultColorScheme({colorScheme: 'teal'})
);

const Main = lazy(() => import('./Main').then(module => ({default: module.Main})));

const Fallback = () => {
    return (
        <HStack as={Center} spacing={3} p={6}>
            <Heading size="lg">Ebbinghaus</Heading>
            <IconButton size="xs" variant="outline" aria-label="add" icon={<AddIcon />} />
            <Switch isChecked={false} />
        </HStack>
    );
};

interface AppProps {
    locales: LocalesContext;
}

export const App = memo(({locales}: AppProps) => {
    return (
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
    );
});
