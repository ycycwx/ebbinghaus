import {Heading, IconButton, Switch} from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons';

const noop = (): void => undefined;

interface TitleProps {
    isOpen: boolean;
    onToggle?: () => void;
    onAdd?: () => void;
}

export const Title = ({isOpen, onToggle = noop, onAdd = noop}: TitleProps) => {
    return (
        <>
            <Heading>Ebbinghaus</Heading>
            <IconButton variant="outline" aria-label="add" icon={<AddIcon />} onClick={onAdd} />
            <Switch isChecked={isOpen} onChange={onToggle} />
        </>
    );
};
