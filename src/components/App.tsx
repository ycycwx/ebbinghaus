import {lazy, memo, StrictMode, Suspense} from 'react';
import {
    Center,
    ChakraProvider,
    HStack,
    extendTheme,
    withDefaultVariant,
    withDefaultColorScheme,
    withDefaultSize,
} from '@chakra-ui/react';
import {Locales} from '../locales';
import {Router} from './Router';
import {Title} from './Title';
import {useBreakpoints} from './useBreakpoints';
import type {LocalesContext} from '../locales';

const Main = lazy(() => import('./Main').then(module => ({default: module.Main})));

const Fallback = () => {
    return (
        <HStack as={Center} spacing={3} p={6}>
            <Title isOpen={false} />
        </HStack>
    );
};

interface AppProps {
    locales: LocalesContext;
}

export const App = memo(({locales}: AppProps) => {
    const {isLargerThan960} = useBreakpoints();
    const theme = extendTheme(
        withDefaultVariant({variant: 'outline'}),
        withDefaultSize({
            size: isLargerThan960 ? 'lg' : 'md',
            components: ['Heading'],
        }),
        withDefaultSize({
            size: isLargerThan960 ? 'md' : 'sm',
            components: ['Switch'],
        }),
        withDefaultSize({
            size: isLargerThan960 ? 'sm' : 'xs',
            components: ['Button', 'IconButton', 'Input', 'Textarea'],
        }),
        withDefaultColorScheme({colorScheme: 'teal'})
    );
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
