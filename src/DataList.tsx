import {Box, List} from '@chakra-ui/react';
import {Item} from './Item';
import type {EbbinghausItem} from '../types/store';

export const DataList = ({data}: {data: EbbinghausItem[] | undefined}) => {
    if (!data || data.length <= 0) {
        return <Box>暂无数据</Box>;
    }

    return (
        <List spacing={3} width="100%">
            {data.map(item => <Item key={item.id} {...item} />)}
        </List>
    );
};
