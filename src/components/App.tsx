import {StrictMode} from 'react';
import {ChakraProvider} from '@chakra-ui/react';
import {Locales} from '../locales';
import {theme} from '../theme';
import {Router} from './Router';
import {Main} from './Main';
import type {LocalesContext} from '../locales';

export const App = ({locales}: {locales: LocalesContext}) => (
    <StrictMode>
        <Locales value={locales}>
            <ChakraProvider theme={theme}>
                <Router>
                    <Main />
                </Router>
            </ChakraProvider>
        </Locales>
    </StrictMode>
);
