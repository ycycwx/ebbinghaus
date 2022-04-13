import {useCallback, useReducer} from 'react';
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
import {useLiveQuery} from 'dexie-react-hooks';
import {addItem, request, updateItem} from '../graphql';
import {useLocaleText} from '../locales';
import {db} from '../db';
import {useBreakpoints} from '../util';
import {useHistory, useParams} from './Router';
import {useChecked} from './Checked';
import type {ChangeEventHandler} from 'react';

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
    const {isSmallerThan540} = useBreakpoints();
    const history = useHistory();
    const disclosure = useChecked();
    const params = useParams<{id?: string}>();
    const [addText, editText, nameText, linkText, descText, submitText, cancelText] = useLocaleText([
        'drawer.header.add',
        'drawer.header.edit',
        'drawer.content.name',
        'drawer.content.link',
        'drawer.content.description',
        'drawer.footer.submit',
        'drawer.footer.cancel',
    ]);
    const id = params.id;

    const [{name, link, desc}, dispatch] = useReducer(reducer, defaultValue);

    const onClose = useCallback(() => history.push('/'), [history]);

    const onClick = useCallback(
        async () => {
            if (name) {
                if (id) {
                    await request(updateItem, {id, name, link, desc});
                }
                else {
                    await request(addItem, {name, link, desc});
                    // redirect to all items tab after adding item
                    disclosure.onOpen();
                }

                onClose();
            }
        },
        [name, id, onClose, link, desc, disclosure]
    );

    const onNameChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        e => dispatch({payload: e.target.value, type: 'name'}),
        []
    );
    const onLinkChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        e => dispatch({payload: e.target.value, type: 'link'}),
        []
    );
    const onDescChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
        e => dispatch({payload: e.target.value, type: 'desc'}),
        []
    );

    const drawerSize = isSmallerThan540 ? 'full' : 'md';
    return (
        <Drawer isOpen placement="right" size={drawerSize} onClose={onClose}>
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
    const data = useLiveQuery(() => db.getItem(id), [id]);
    if (!data) {
        return null;
    }
    return <DrawerInternal defaultValue={data} />;
};

export const DrawerForm = () => {
    const params = useParams<{id?: string}>();
    const id = params.id;
    if (!id) {
        return <CreateForm />;
    }
    return <EditForm id={+id} />;
};
