import {useCallback} from 'react';
import {HStack, VStack, useDisclosure} from '@chakra-ui/react';
import {useItems} from '../db/hooks';
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
    const disclosure = useDisclosure();
    const data = useItems({
        variant: disclosure.isOpen ? 'all' : 'available',
        polling: 60_000,
    });

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
