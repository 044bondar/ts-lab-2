import './styles/main.scss';
import { AppRenderer } from './components/render';

document.addEventListener('DOMContentLoaded', () => {
    const appRoot = document.getElementById('app');
    if (appRoot) {
        new AppRenderer(appRoot);
    }
});