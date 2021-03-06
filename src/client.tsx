import {hydrateRoot} from 'react-dom/client';
import {App} from './components/App';
import {getUniversalLocales} from './util';

const locales = getUniversalLocales(navigator.language);

const root = document.getElementById('root');
if (root) {
    hydrateRoot(root, <App locales={locales} />);
}
