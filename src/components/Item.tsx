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
} from '@chakra-ui/react';
import {CheckIcon, SmallCloseIcon, EditIcon, RepeatClockIcon} from '@chakra-ui/icons';
import formatDistance from 'date-fns/formatDistance';
import {useMutate} from '../context';
import {deleteItem, request, updateStage, updateUpdateTime} from '../graphql';
import {isAvailable, useForceUpdate, useInterval} from '../util';
import {useHistory} from './Router';
import type {EbbinghausItem} from '../../types/store';

export const Item = (props: EbbinghausItem) => {
    const {
        name,
        link,
        updateTime,
        id,
    } = props;
    const history = useHistory();
    const available = isAvailable(props);
    const mutate = useMutate();
    const onRemove = useCallback(
        async () => {
            if (id) {
                await request(deleteItem, {id});
                await mutate();
            }
        },
        [id, mutate]
    );

    const onEdit = useCallback(
        () => {
            if (id) {
                history.push(`/edit/${id}`);
            }
        },
        [id, history]
    );

    const forceUpdate = useForceUpdate();
    useInterval(forceUpdate, 60_000);

    /* eslint-disable react/jsx-no-bind */
    return (
        <HStack as={ListItem} justifyContent="space-between">
            {
                link
                    ? <Link href={link} isExternal>{name ?? '--'}</Link>
                    : <Box>{name ?? '--'}</Box>
            }
            <HStack spacing={3}>
                <Text>{formatDistance(updateTime, new Date(), {addSuffix: true})}</Text>
                <IconButton aria-label="edit" icon={<EditIcon />} onClick={onEdit} />
                <Popover>
                    {({onClose}) => (
                        <>
                            <PopoverTrigger>
                                <IconButton aria-label="repeat" icon={<RepeatClockIcon />} />
                            </PopoverTrigger>
                            <PopoverContent width={100}>
                                <Button
                                    variant="solid"
                                    onClick={async () => {
                                        if (id) {
                                            await request(updateUpdateTime, {id});
                                            await mutate();
                                            onClose();
                                        }
                                    }}
                                >
                                    延期处理
                                </Button>
                            </PopoverContent>
                        </>
                    )}
                </Popover>
                <Popover>
                    {({onClose}) => (
                        <>
                            <PopoverTrigger>
                                <IconButton disabled={!available} aria-label="resovle" icon={<CheckIcon />} />
                            </PopoverTrigger>
                            <PopoverContent width={100}>
                                <Button
                                    variant="solid"
                                    onClick={async () => {
                                        if (id) {
                                            await request(updateStage, {id});
                                            await mutate();
                                            onClose();
                                        }
                                    }}
                                >
                                    确认记住
                                </Button>
                            </PopoverContent>
                        </>
                    )}
                </Popover>
                <Popover>
                    <PopoverTrigger>
                        <IconButton aria-label="remove" icon={<SmallCloseIcon />} />
                    </PopoverTrigger>
                    <PopoverContent width={100}>
                        <Button variant="solid" colorScheme="red" onClick={onRemove}>
                            确认删除
                        </Button>
                    </PopoverContent>
                </Popover>
            </HStack>
        </HStack>
    );
    /* eslint-enable react/jsx-no-bind */
};
