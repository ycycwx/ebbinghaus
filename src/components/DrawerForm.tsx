import {useCallback, useReducer} from 'react';
import useSWR, {useSWRConfig} from 'swr';
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
import {addItem, getItem, getItems, request, updateItem} from '../graphql';
import {useLocaleText} from '../locales';
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

const DrawerInternal = ({defaultValue = defaults}: {defaultValue?: State}) => {
    const history = useHistory();
    const [addText, editText, nameText, linkText, descText, submitText, cancelText] = useLocaleText([
        'drawer.header.add',
        'drawer.header.edit',
        'drawer.content.name',
        'drawer.content.link',
        'drawer.content.description',
        'drawer.footer.submit',
        'drawer.footer.cancel',
    ]);
    const params = useParams<{id?: string}>();
    const id = params.id;

    const [{name, link, desc}, dispatch] = useReducer(reducer, defaultValue);

    const onClose = useCallback(() => history.push('/'), [history]);

    const {mutate} = useSWRConfig();
    const onClick = useCallback(
        async () => {
            if (name) {
                if (id) {
                    await request(updateItem, {id, name, link, desc});
                    void mutate([getItem, id]);
                }
                else {
                    await request(addItem, {name, link, desc});
                    void mutate([getItems, false]);
                }

                void mutate([getItems, true]);

                onClose();
            }
        },
        [desc, id, link, mutate, name, onClose]
    );

    const onNameChange = useCallback(e => dispatch({payload: e.target.value, type: 'name'}), []);
    const onLinkChange = useCallback(e => dispatch({payload: e.target.value, type: 'link'}), []);
    const onDescChange = useCallback(e => dispatch({payload: e.target.value, type: 'desc'}), []);

    return (
        <Drawer isOpen placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>{id ? editText : addText}</DrawerHeader>
                <DrawerBody>
                    <FormControl isRequired>
                        <FormLabel>{nameText}</FormLabel>
                        <Input value={name} onChange={onNameChange} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>{linkText}</FormLabel>
                        <Input value={link} onChange={onLinkChange} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>{descText}</FormLabel>
                        <Textarea value={desc} onChange={onDescChange} />
                    </FormControl>
                </DrawerBody>
                <DrawerFooter>
                    <HStack spacing={3}>
                        <Button variant="outline" onClick={onClose}>
                            {cancelText}
                        </Button>
                        <Button type="submit" disabled={!name} onClick={onClick}>
                            {submitText}
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
    const {data} = useSWR(id ? [getItem, id] : null, (getItem, id) => request(getItem, {id}));
    if (!data) {
        return null;
    }
    return <DrawerInternal defaultValue={data.data.item} />;
};

export const DrawerForm = () => {
    const params = useParams<{id?: string}>();
    const id = params.id;
    if (!id) {
        return <CreateForm />;
    }
    return <EditForm id={+id} />;
};
