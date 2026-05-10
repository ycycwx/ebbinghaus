import {createRoot} from 'react-dom/client';
import {App} from './components/App';
import {getUniversalLocales} from './util';
import {registerServiceWorker} from './registerServiceWorker';

const locales = getUniversalLocales(navigator.language);

const root = document.getElementById('root');
if (root) {
    createRoot(root).render(<App locales={locales} />);
}

registerServiceWorker();
