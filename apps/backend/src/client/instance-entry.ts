import type { InstanceViewProps } from './pages/Instance.js';

// Lazy load the InstanceView component
const { InstanceView, isInstanceViewProps } = await import('./pages/Instance.js');
const { hydrateApp } = await import('@dockview/react-ssr/client');

const initialProps = window.__INITIAL_STATE__ || {};

let props: InstanceViewProps;

if (isInstanceViewProps(initialProps)) {
    props = initialProps;
} else {
    throw new Error('Invalid initial props');
}

// Hydrate the app
hydrateApp(InstanceView, props, {
    onHydrated: () => {
        window.__HYDRATED__ = true;

        if (typeof window.__INIT_WS__ === 'function') {
            window.__INIT_WS__();
        }
    }
});

