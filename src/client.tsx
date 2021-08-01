import {hydrateRoot} from 'react-dom';
import {App} from './App';

const root = document.getElementById('root');
if (root) {
    hydrateRoot(root, <App /> as any);
}
