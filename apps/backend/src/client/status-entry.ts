import { hydrateApp } from '@dockview/react-ssr/client';
import { isStatusViewProps, StatusView, StatusViewProps } from './pages/Status.js';

const initialProps = window.__INITIAL_STATE__ || {};

let props: StatusViewProps;

if (isStatusViewProps(initialProps)) {
    props = initialProps;
} else {
    throw new Error('Invalid initial props');
}

// Hydrate the app
hydrateApp(StatusView, props, {
    onHydrated: () => {
        window.__HYDRATED__ = true;

        if (typeof window.__INIT_WS__ === 'function') {
            window.__INIT_WS__();
        }
    }
});
