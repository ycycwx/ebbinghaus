import {lazy, Suspense} from 'react';
import {
    ChakraProvider,
    Center,
    IconButton,
    Switch,
    Heading,
    HStack,
    extendTheme,
    withDefaultVariant,
    withDefaultColorScheme,
    withDefaultSize,
} from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons';
import {Router} from './Router';

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

export const App = () => {
    return (
        <ChakraProvider theme={theme}>
            <Router>
                <Suspense fallback={<Fallback />}>
                    <Main />
                </Suspense>
            </Router>
        </ChakraProvider>
    );
};
