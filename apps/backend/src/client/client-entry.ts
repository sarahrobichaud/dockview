import ReactDOM from "react-dom/client";
import { InstanceView } from "./pages/Instance.js";
import React from "react";

declare global {
    interface Window {
        __INITIAL_STATE__: Record<string, any>;
    }
}

// Component registry
const COMPONENTS: Record<string, React.ComponentType<any>> = {
    'instance-view': InstanceView,
};

// Hydrate components when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dockview client hydration initializing');

    const initialState = window.__INITIAL_STATE__ || {};

    const hydrateElements = document.querySelectorAll('[data-hydrate-id]');

    if (hydrateElements.length === 0) {
        console.log('No components found for hydration');
    }

    hydrateElements.forEach(element => {
        const id = element.getAttribute('data-hydrate-id');
        const propsJson = element.getAttribute('data-hydrate-props');

        if (!id || !propsJson) {
            console.warn('Missing hydration data');
            return;
        }

        const Component = COMPONENTS[id];

        if (!Component) {
            console.warn(`Component not found for hydration: ${id}`);
            return;
        }

        try {
            // Parse the props
            const props = JSON.parse(propsJson);

            const mergedProps = {
                ...props,
                initialState,
            };

            ReactDOM.createRoot(element).render(
                React.createElement(Component, mergedProps),
            );

            console.log(`Hydrated component: ${id}`);
        } catch (error) {
            console.error(`Error hydrating component ${id}:`, error);
        }
    });

});