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
import {addItem, request, updateItem} from '../graphql';
import {useLocaleText} from '../locales';
import {useItem} from '../db/hooks';
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
    const history = useHistory();
    const disclosure = useChecked();
    const params: {id?: string} = useParams();
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

    const onClose = useCallback(
        () => {
            history.push('/');
        },
        [history]
    );

    const onClick = useCallback(async () => {
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
    }, [name, id, onClose, link, desc, disclosure]);

    const onNameChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        e => {
            dispatch({payload: e.target.value, type: 'name'});
        },
        []
    );
    const onLinkChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        e => {
            dispatch({payload: e.target.value, type: 'link'});
        },
        []
    );
    const onDescChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
        e => {
            dispatch({payload: e.target.value, type: 'desc'});
        },
        []
    );

    return (
        <Drawer isOpen placement="right" size="md" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>{id ? editText : addText}</DrawerHeader>
                <DrawerBody>
                    <FormControl isRequired>
                        <FormLabel>{nameText}</FormLabel>
                        <Input size="sm" value={name} onChange={onNameChange} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>{linkText}</FormLabel>
                        <Input size="sm" value={link} onChange={onLinkChange} />
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
    const data = useItem(id);
    if (!data) {
        return null;
    }
    return <DrawerInternal defaultValue={data} />;
};

export const DrawerForm = () => {
    const params: {id?: string} = useParams();
    const id = params.id;
    if (!id) {
        return <CreateForm />;
    }
    return <EditForm id={+id} />;
};
