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
    useDisclosure,
} from '@chakra-ui/react';
import {CheckIcon, SmallCloseIcon} from '@chakra-ui/icons';
import {useMutate} from './mutate';
import {getNextStage, isAvailable} from './util';
import {db} from './db';
import type {EbbinghausItem} from '../types/store';

export const Item = (props: EbbinghausItem) => {
    const {
        name,
        link,
        stage,
        id,
    } = props;
    const available = isAvailable(props);
    const {onOpen, onClose, isOpen} = useDisclosure();
    const mutate = useMutate();
    const onResolve = useCallback(
        async () => {
            if (id) {
                await db.items.update(id, {updateTime: Date.now(), stage: getNextStage(stage)});
                await mutate();
                onClose();
            }
        },
        [id, mutate, onClose, stage]
    );

    const onRemove = useCallback(
        async () => {
            if (id) {
                await db.items.delete(id);
                await mutate();
            }
        },
        [id, mutate]
    );

    return (
        <HStack as={ListItem} justifyContent="space-between">
            {
                link
                    ? <Link href={link} isExternal>{name ?? '--'}</Link>
                    : <Box>{name ?? '--'}</Box>
            }
            <HStack spacing={3}>
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
