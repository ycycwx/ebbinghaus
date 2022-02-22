import {useMediaQuery} from '@chakra-ui/react';

const breakpoints = [
    '(min-width: 960px)',
];

export const useBreakpoints = () => {
    const [isLargerThan960] = useMediaQuery(breakpoints);
    return {isLargerThan960};
};
