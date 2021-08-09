import useSWR from 'swr';
import {Accordion, AccordionItem, AccordionIcon, AccordionPanel, AccordionButton, Box, Heading} from '@chakra-ui/react';
import {getItems, request} from '../graphql';

export const Debug = () => {
    const {data} = useSWR(getItems, () => request(getItems, {variant: 'all'}), {refreshInterval: 1000});
    if (!data) {
        return null;
    }

    return (
        <Accordion allowToggle width="100%">
            <AccordionItem>
                <AccordionButton>
                    <Heading flex="1" textAlign="left">
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

