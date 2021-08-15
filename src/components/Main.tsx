import {lazy, useCallback, Suspense} from 'react';
import {
    HStack,
    Heading,
    IconButton,
    Switch,
    VStack,
    useBoolean,
} from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons';
import useSWR from 'swr';
import {Mutate} from '../context';
import {getItems, request} from '../graphql';
import {DataList} from './DataList';
import {useHistory} from './Router';
import type {EbbinghausItem} from '../../types/store';

const Debug = lazy(() => import('./Debug').then(module => ({default: module.Debug})));
const Form = lazy(() => import('./Form').then(module => ({default: module.Form})));

export const Main = () => {
    const history = useHistory();
    const onAdd = useCallback(() => history.push('/add'), [history]);
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
                    <IconButton
                        size="xs"
                        variant="outline"
                        aria-label="add"
                        icon={<AddIcon />}
                        onClick={onAdd}
                    />
                    <Switch isChecked={isChecked} onChange={toggle} />
                </HStack>
                <VStack spacing={4} p={5} width="100%">
                    <DataList data={data?.data.items} />
                    <Suspense fallback={null}>{import.meta.env.DEV && <Debug />}</Suspense>
                </VStack>
                <Suspense fallback={null}>
                    <Form />
                </Suspense>
            </VStack>
        </Mutate>
    );
};
