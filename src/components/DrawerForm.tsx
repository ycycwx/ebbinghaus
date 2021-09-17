import {useCallback, useReducer} from 'react';
import useSWR from 'swr';
import {
    Button,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    DrawerFooter,
    DrawerCloseButton,
    DrawerHeader,
    HStack,
    Input,
    FormControl,
    FormLabel,
    Textarea,
} from '@chakra-ui/react';
import {useMutate} from '../context';
import {addItem, getItem, request, updateItem} from '../graphql';
import {useHistory, useParams} from './Router';

interface State {
    name: string;
    link?: string;
    desc?: string;
}

type Action =
    | {type: 'name', payload: string}
    | {type: 'link', payload: string}
    | {type: 'desc', payload: string}
    | {type: 'reset'};

const defaults: State = {
    name: '',
    link: '',
    desc: '',
};

const reducer = (state: State, action: Action) => {
    if (action.type === 'name') {
        return {...state, name: action.payload};
    }
    if (action.type === 'link') {
        return {...state, link: action.payload};
    }
    if (action.type === 'desc') {
        return {...state, desc: action.payload};
    }
    return {name: '', link: '', desc: ''};
};

const DrawerInternal = ({defaultValue = defaults, updateCache}: {
    defaultValue?: State;
    updateCache?: () => void;
}) => {
    const params = useParams<{id?: string}>();
    const id = params.id;
    const history = useHistory();
    const onClose = useCallback(() => history.push('/'), [history]);
    const mutate = useMutate();
    const [{name, link, desc}, dispatch] = useReducer(reducer, defaultValue);
    const onClick = useCallback(
        async () => {
            if (name) {
                if (id) {
                    await request(updateItem, {id, name, link, desc});
                    updateCache?.();
                }
                else {
                    await request(addItem, {name, link, desc});
                }

                onClose();
                await mutate();
            }
        },
        [desc, id, link, mutate, name, onClose, updateCache]
    );

    const onNameChange = useCallback(e => dispatch({payload: e.target.value, type: 'name'}), []);
    const onLinkChange = useCallback(e => dispatch({payload: e.target.value, type: 'link'}), []);
    const onDescChange = useCallback(e => dispatch({payload: e.target.value, type: 'desc'}), []);

    return (
        <Drawer isOpen placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>{id ? '编辑' : '新增'}记录</DrawerHeader>
                <DrawerBody>
                    <FormControl isRequired>
                        <FormLabel>名称</FormLabel>
                        <Input value={name} onChange={onNameChange} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>链接</FormLabel>
                        <Input value={link} onChange={onLinkChange} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>描述</FormLabel>
                        <Textarea value={desc} onChange={onDescChange} />
                    </FormControl>
                </DrawerBody>
                <DrawerFooter>
                    <HStack spacing={3}>
                        <Button variant="outline" onClick={onClose}>
                            取消
                        </Button>
                        <Button type="submit" disabled={!name} onClick={onClick}>
                            提交
                        </Button>
                    </HStack>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

const CreateForm = () => {
    return <DrawerInternal defaultValue={defaults} />;
};

const EditForm = ({id}: {id: number}) => {
    const {data, mutate} = useSWR(id ? [getItem, id] : null, (getItem, id) => request(getItem, {id}));
    if (!data) {
        return null;
    }
    return <DrawerInternal defaultValue={data.data.item} updateCache={mutate} />;
};

export const DrawerForm = () => {
    const params = useParams<{id?: string}>();
    const id = params.id;
    if (!id) {
        return <CreateForm />;
    }
    return <EditForm id={+id} />;
};
