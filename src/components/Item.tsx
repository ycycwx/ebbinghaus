import {
    Badge,
    Button,
    HStack,
    IconButton,
    ListItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Text,
    Tooltip,
    useTheme,
} from '@chakra-ui/react';
import {CheckIcon, SmallCloseIcon, EditIcon, RepeatClockIcon, RepeatIcon} from '@chakra-ui/icons';
import {addDays, formatDistanceToNow} from 'date-fns';
import {useLocaleDate, useLocaleText} from '../locales';
import {deleteItem, request, resetItem, updateStage, updateUpdateTime} from '../graphql';
import {isAvailable, isFinished, useBreakpoints, useForceUpdate, useInterval} from '../util';
import {useHistory} from './Router';
import {Name} from './Name';
import type {EbbinghausItem} from '../../types/store';

// eslint-disable-next-line max-lines-per-function
export const Item = ({name, link, updateTime, id, stage, ...props}: EbbinghausItem) => {
    const {isLargerThan960} = useBreakpoints();
    const history = useHistory();
    const theme = useTheme();
    const dateLocale = useLocaleDate();
    const [delayText, finishText, removeText, resetText] = useLocaleText([
        'dataList.action.delay',
        'dataList.action.finish',
        'dataList.action.remove',
        'dataList.action.reset',
    ]);

    const available = isAvailable({name, link, updateTime, id, stage, ...props});
    const hasFinish = isFinished(stage);

    const forceUpdate = useForceUpdate();
    useInterval(forceUpdate, 60_000);

    return (
        <HStack
            as={ListItem}
            justifyContent="space-between"
            sx={{
                p: 2,
                borderRadius: 2,
                ':hover': {
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    bgColor: theme.colors.teal['50'],
                },
            }}
        >
            <Name name={name} link={link} />
            <HStack spacing={3}>
                {isLargerThan960 && (
                    <Tooltip
                        label={
                            available || hasFinish
                                ? null
                                : formatDistanceToNow(addDays(updateTime, stage), {addSuffix: true, locale: dateLocale})
                        }
                        isDisabled={available || hasFinish}
                    >
                        <Text>{formatDistanceToNow(updateTime, {addSuffix: true, locale: dateLocale})}</Text>
                    </Tooltip>
                )}
                {isLargerThan960 ? (
                    <Badge variant="solid" fontFamily="monospace">
                        {stage > 28 ? 'MAX' : stage}
                    </Badge>
                ) : null}
                <IconButton
                    aria-label="edit"
                    icon={<EditIcon />}
                    onClick={() => {
                        if (id) {
                            history.push(`/edit/${id}`);
                        }
                    }}
                />
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
                                        }

                                        onClose();
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
                                        }

                                        onClose();
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
                        <Button
                            variant="solid"
                            colorScheme="red"
                            onClick={async () => {
                                if (id) {
                                    await request(deleteItem, {id});
                                }
                            }}
                        >
                            {removeText}
                        </Button>
                    </PopoverContent>
                </Popover>
                <Popover>
                    {({onClose}) => (
                        <>
                            <PopoverTrigger>
                                <IconButton aria-label="reset" icon={<RepeatIcon />} />
                            </PopoverTrigger>
                            <PopoverContent width={100}>
                                <Button
                                    variant="solid"
                                    colorScheme="red"
                                    onClick={async () => {
                                        if (id) {
                                            await request(resetItem, {id});
                                        }
                                        onClose();
                                    }}
                                >
                                    {resetText}
                                </Button>
                            </PopoverContent>
                        </>
                    )}
                </Popover>
            </HStack>
        </HStack>
    );
};
