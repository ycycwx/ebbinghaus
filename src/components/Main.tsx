import {lazy, useCallback, Suspense} from 'react';
import {HStack, VStack, useDisclosure} from '@chakra-ui/react';
import {useLiveQuery} from 'dexie-react-hooks';
import {db} from '../db';
import {useIntervalToken} from '../util';
import {useHistory} from './Router';
import {Checked} from './Checked';
import {Title} from './Title';

const Debug = lazy(() => import('./Debug').then(module => ({default: module.Debug})));
const Form = lazy(() => import('./Form').then(module => ({default: module.Form})));
const DataList = lazy(() => import('./DataList').then(module => ({default: module.DataList})));

export const Main = () => {
    const history = useHistory();
    const onAdd = useCallback(() => history.push('/add'), [history]);

    // polling the database
    const token = useIntervalToken(60_000);
    const disclosure = useDisclosure();
    const data = useLiveQuery(
        () => db.loadAllItems({variant: disclosure.isOpen ? 'all' : 'available'}),
        [disclosure.isOpen, token]
    );

    return (
        <VStack p={6} m="0 auto" maxWidth={800}>
            <Checked value={disclosure}>
                <HStack spacing={3}>
                    <Title isOpen={disclosure.isOpen} onToggle={disclosure.onToggle} onAdd={onAdd} />
                </HStack>
                <VStack spacing={4} p={5} width="100%">
                    <DataList data={data} />
                    <Suspense fallback={null}>{import.meta.env.DEV && <Debug />}</Suspense>
                </VStack>
                <Suspense fallback={null}>
                    <Form />
                </Suspense>
            </Checked>
        </VStack>
    );
};
