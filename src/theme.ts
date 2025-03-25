import {
    extendTheme,
    withDefaultVariant,
    withDefaultColorScheme,
    withDefaultSize,
} from '@chakra-ui/react';

export const theme = extendTheme(
    withDefaultVariant({variant: 'outline'}),
    withDefaultSize({
        size: 'sm',
        components: ['Button'],
    }),
    withDefaultColorScheme({colorScheme: 'teal'})
);
