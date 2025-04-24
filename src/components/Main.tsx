import {useCallback} from 'react';
import {HStack, VStack, useDisclosure} from '@chakra-ui/react';
import {useLiveQuery} from 'dexie-react-hooks';
import {db} from '../db';
import {useIntervalToken} from '../util';
import {Checked} from './Checked';
import {DataList} from './DataList';
import {Debug} from './Debug';
import {Form} from './Form';
import {Title} from './Title';
import {useHistory} from './Router';

export const Main = () => {
    const history = useHistory();
    const onAdd = useCallback(() => {
        history.push('/add');
    }, [history]);

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
                    {import.meta.env.DEV && <Debug />}
                </VStack>
                <Form />
            </Checked>
        </VStack>
    );
};
