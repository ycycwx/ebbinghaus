import {Box, List} from '@chakra-ui/react';
import {useLocaleText} from '../locales';
import {Item} from './Item';
import type {EbbinghausItem} from '../../types/store';

export const DataList = ({data}: {data: EbbinghausItem[] | undefined}) => {
    const emptyText = useLocaleText('dataList.list.emptyText');

    if (!data || data.length <= 0) {
        return <Box>{emptyText}</Box>;
    }

    return (
        <List spacing={3} width="100%">
            {data.map(item => <Item key={item.id} {...item} />)}
        </List>
    );
};
