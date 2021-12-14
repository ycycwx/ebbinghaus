import {lazy, useCallback, Suspense} from 'react';
import {
    HStack,
    Heading,
    IconButton,
    Switch,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons';
import {useLiveQuery} from 'dexie-react-hooks';
import {db} from '../db';
import {useHistory} from './Router';
import {Checked} from './Checked';

const Debug = lazy(() => import('./Debug').then(module => ({default: module.Debug})));
const Form = lazy(() => import('./Form').then(module => ({default: module.Form})));
const DataList = lazy(() => import('./DataList').then(module => ({default: module.DataList})));

export const Main = () => {
    const history = useHistory();
    const onAdd = useCallback(() => history.push('/add'), [history]);
    const disclosure = useDisclosure();
    const data = useLiveQuery(
        () => db.loadAllItems({variant: disclosure.isOpen ? 'all' : 'available'}),
        [disclosure.isOpen]
    );
    return (
        <VStack p={6} m="0 auto" maxWidth={800}>
            <Checked value={disclosure}>
                <HStack spacing={3}>
                    <Heading size="lg">Ebbinghaus</Heading>
                    <IconButton size="xs" variant="outline" aria-label="add" icon={<AddIcon />} onClick={onAdd} />
                    <Switch isChecked={disclosure.isOpen} onChange={disclosure.onToggle} />
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
