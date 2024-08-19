import {Box, Link} from '@chakra-ui/react';
import type {EbbinghausItem} from '../../types/store';

const ellipsis = {
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': '1',
    '-webkit-box-orient': 'vertical',
};

export const Name = ({name, link}: Pick<EbbinghausItem, 'name' | 'link'>) => {
    if (link) {
        return (
            <Link href={link} isExternal sx={ellipsis} title={name}>
                {name ?? '--'}
            </Link>
        );
    }

    return (
        <Box sx={ellipsis} title={name}>
            {name ?? '--'}
        </Box>
    );
};
