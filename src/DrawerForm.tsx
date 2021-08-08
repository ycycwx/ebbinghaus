import {useCallback, useEffect, useReducer} from 'react';
import {
    Button,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    DrawerFooter,
    DrawerCloseButton,
    DrawerHeader,
    Input,
    FormControl,
    FormLabel,
    Textarea,
} from '@chakra-ui/react';
import {useMutate} from './mutate';
import {addItem, request} from './graphql';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

type Action =
    | {type: 'name', payload: string}
    | {type: 'link', payload: string}
    | {type: 'desc', payload: string}
    | {type: 'reset'};

const reducer = (state: {name: string, link: string, desc: string}, action: Action) => {
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

export const DrawerForm = ({isOpen, onClose}: Props) => {
    const mutate = useMutate();
    const [{name, link, desc}, dispatch] = useReducer(reducer, {name: '', link: '', desc: ''});
    const onClick = useCallback(
        async () => {
            if (name) {
                await request(addItem, {name, link, desc});
                onClose();
                await mutate();
            }
        },
        [desc, link, mutate, name, onClose]
    );
    const onNameChange = useCallback(e => dispatch({payload: e.target.value, type: 'name'}), []);
    const onLinkChange = useCallback(e => dispatch({payload: e.target.value, type: 'link'}), []);
    const onDescChange = useCallback(e => dispatch({payload: e.target.value, type: 'desc'}), []);

    useEffect(
        () => () => {
            if (!isOpen) {
                dispatch({type: 'reset'});
            }
        },
        [isOpen]
    );

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>新增记录</DrawerHeader>
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
                    <Button variant="outline" mr={3} onClick={onClose}>
                        取消
                    </Button>
                    <Button type="submit" disabled={!name} onClick={onClick}>
                        提交
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
