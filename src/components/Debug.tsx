import {Accordion, AccordionItem, AccordionIcon, AccordionPanel, AccordionButton, Box, Heading} from '@chakra-ui/react';
import {useLiveQuery} from 'dexie-react-hooks';
import {db} from '../db';

export const Debug = () => {
    const data = useLiveQuery(() => db.loadAllItems({variant: 'all'}));
    if (!data) {
        return null;
    }

    return (
        <Accordion allowToggle width="100%">
            <AccordionItem>
                <AccordionButton>
                    <Heading as="h5" size="sm" flex="1" textAlign="left">
                        Debug
                    </Heading>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                    <Box fontSize={12} as="pre">{JSON.stringify(data, null, 2)}</Box>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};
