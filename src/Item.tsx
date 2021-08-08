import {useCallback} from 'react';
import {
    Box,
    Button,
    HStack,
    IconButton,
    Link,
    ListItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import {CheckIcon, SmallCloseIcon} from '@chakra-ui/icons';
import formatDistance from 'date-fns/formatDistance';
import {useMutate} from './mutate';
import {request} from './graphql';
import {isAvailable, useForceUpdate, useInterval} from './util';
import type {EbbinghausItem} from '../types/store';

const updateItem = `
mutation UpdateItem($id: ID!) {
    updateItem(id: $id)
}
`;

const deleteItem = `
mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
}
`;

export const Item = (props: EbbinghausItem) => {
    const {
        name,
        link,
        updateTime,
        id,
    } = props;
    const available = isAvailable(props);
    const {onOpen, onClose, isOpen} = useDisclosure();
    const mutate = useMutate();
    const onResolve = useCallback(
        async () => {
            if (id) {
                await request(updateItem, {id});
                await mutate();
                onClose();
            }
        },
        [id, mutate, onClose]
    );

    const onRemove = useCallback(
        async () => {
            if (id) {
                await request(deleteItem, {id});
                await mutate();
            }
        },
        [id, mutate]
    );

    const forceUpdate = useForceUpdate();
    useInterval(forceUpdate, 6000);

    return (
        <HStack as={ListItem} justifyContent="space-between">
            {
                link
                    ? <Link href={link} isExternal>{name ?? '--'}</Link>
                    : <Box>{name ?? '--'}</Box>
            }
            <HStack spacing={3}>
                <Text>{formatDistance(updateTime, new Date(), {addSuffix: true})}</Text>
                <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                    <PopoverTrigger>
                        <IconButton disabled={!available} aria-label="resovle" icon={<CheckIcon />} />
                    </PopoverTrigger>
                    <PopoverContent width={100}>
                        <Button variant="solid" onClick={onResolve}>确认记住</Button>
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger>
                        <IconButton aria-label="remove" icon={<SmallCloseIcon />} />
                    </PopoverTrigger>
                    <PopoverContent width={100}>
                        <Button variant="solid" colorScheme="red" onClick={onRemove}>确认删除</Button>
                    </PopoverContent>
                </Popover>
            </HStack>
        </HStack>
    );
};
