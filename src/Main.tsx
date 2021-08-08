import {lazy, Suspense} from 'react';
import {
    HStack,
    Heading,
    IconButton,
    Switch,
    VStack,
    useBoolean,
    useDisclosure,
} from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons';
import useSWR from 'swr';
import {DataList} from './DataList';
import {Mutate} from './mutate';
import {getItems, request} from './graphql';
import type {EbbinghausItem} from '../types/store';

const Debug = lazy(() => import('./Debug').then(module => ({default: module.Debug})));
const DrawerForm = lazy(() => import('./DrawerForm').then(module => ({default: module.DrawerForm})));

export const Main = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [isChecked, {toggle}] = useBoolean();
    const {data, mutate} = useSWR<{data: {items: EbbinghausItem[]}}>(
        [getItems, isChecked],
        (query: string, isChecked: boolean) => request(query, {variant: isChecked ? 'all' : 'available'})
    );
    return (
        <Mutate value={mutate}>
            <VStack p={6} m="0 auto" maxWidth={800}>
                <HStack spacing={3}>
                    <Heading size="lg">Ebbinghaus</Heading>
                    <IconButton size="xs" variant="outline" aria-label="add" icon={<AddIcon />} onClick={onOpen} />
                    <Switch isChecked={isChecked} onChange={toggle} />
                </HStack>
                <VStack spacing={4} p={5} width="100%">
                    <DataList data={data?.data.items} />
                    <Suspense fallback={null}>
                        {import.meta.env.DEV && <Debug />}
                    </Suspense>
                </VStack>
                <Suspense fallback={null}>
                    <DrawerForm isOpen={isOpen} onClose={onClose} />
                </Suspense>
            </VStack>
        </Mutate>
    );
};
