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
    useTheme,
} from '@chakra-ui/react';
import {CheckIcon, SmallCloseIcon, EditIcon, RepeatClockIcon} from '@chakra-ui/icons';
import formatDistance from 'date-fns/formatDistance';
import {useLocaleDate, useLocaleText} from '../locales';
import {deleteItem, request, updateStage, updateUpdateTime} from '../graphql';
import {isAvailable, useForceUpdate, useInterval} from '../util';
import {useHistory} from './Router';
import {useBreakpoints} from './useBreakpoints';
import type {EbbinghausItem} from '../../types/store';

const ellipsis = {
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': '1',
    '-webkit-box-orient': 'vertical',
};

export const Item = (props: EbbinghausItem) => {
    const {isLargerThan960} = useBreakpoints();
    const history = useHistory();
    const theme = useTheme();
    const dateLocale = useLocaleDate();
    const [delayText, finishText, removeText] = useLocaleText([
        'dataList.action.delay',
        'dataList.action.finish',
        'dataList.action.remove',
    ]);

    const {name, link, updateTime, id} = props;
    const available = isAvailable(props);

    const onRemove = useCallback(
        async () => {
            if (id) {
                await request(deleteItem, {id});
            }
        },
        [id]
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
        <HStack
            as={ListItem}
            justifyContent="space-between"
            sx={{
                p: 2,
                borderRadius: 2,
                ':hover': {
                    bgColor: theme.colors.teal['50'],
                },
            }}
        >
            {
                link
                    ? <Link href={link} isExternal sx={ellipsis} title={name}>{name ?? '--'}</Link>
                    : <Box sx={ellipsis} title={name}>{name ?? '--'}</Box>
            }
            <HStack spacing={3}>
                {
                    isLargerThan960 && (
                        <Text>
                            {formatDistance(updateTime, new Date(), {addSuffix: true, locale: dateLocale})}
                        </Text>
                    )
                }
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

                                            onClose();
                                        }
                                    }}
                                >
                                    {delayText}
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

                                            onClose();
                                        }
                                    }}
                                >
                                    {finishText}
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
                            {removeText}
                        </Button>
                    </PopoverContent>
                </Popover>
            </HStack>
        </HStack>
    );
    /* eslint-enable react/jsx-no-bind */
};
