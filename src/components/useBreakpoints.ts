import {useMediaQuery} from '@chakra-ui/react';

const breakpoints = [
    '(min-width: 960px)',
    '(max-width: 540px)',
];

export const useBreakpoints = () => {
    const [isLargerThan960, isSmallerThan540] = useMediaQuery(breakpoints);
    return {isLargerThan960, isSmallerThan540};
};
