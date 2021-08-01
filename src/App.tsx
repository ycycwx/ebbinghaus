import {lazy, useCallback, Suspense} from 'react';
import {
    ChakraProvider,
    HStack,
    Heading,
    IconButton,
    VStack,
    extendTheme,
    useDisclosure,
    withDefaultVariant,
    withDefaultColorScheme,
    withDefaultSize,
} from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons';
import useSWR from 'swr';
import {DataList} from './DataList';
import {db} from './db';
import {DrawerForm} from './DrawerForm';
import type {EbbinghausItem} from '../types/store';

const Debug = lazy(() => import('./Debug').then(module => ({default: module.Debug})));

const theme = extendTheme(
    withDefaultVariant({variant: 'outline'}),
    withDefaultSize({size: 'sm'}),
    withDefaultColorScheme({colorScheme: 'teal'})
);

export const App = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {data, mutate} = useSWR<EbbinghausItem[]>('db.loadAvailableItems', () => db.loadAvailableItems());
    const onAdd = useCallback(
        async (item: EbbinghausItem) => {
            await db.items.add(item);
            await mutate();
        },
        [mutate]
    );

    return (
        <ChakraProvider theme={theme}>
            <VStack p={6} m="0 auto" maxWidth={800}>
                <HStack spacing={2}>
                    <Heading size="lg">Ebbinghaus</Heading>
                    <IconButton size="xs" variant="outline" aria-label="add" icon={<AddIcon />} onClick={onOpen} />
                </HStack>
                <VStack spacing={4} p={5} width="100%">
                    <DataList data={data} mutate={mutate} />
                    {import.meta.env.DEV && <Suspense fallback={null}><Debug /></Suspense>}
                </VStack>
                <DrawerForm isOpen={isOpen} onClose={onClose} onAdd={onAdd} />
            </VStack>
        </ChakraProvider>
    );
};
