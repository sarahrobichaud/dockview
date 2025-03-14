import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';

export interface HydrationOptions {
  rootElement?: HTMLElement;
  onHydrated?: () => void;
}

export function hydrateApp<P extends object = {}>(
  App: React.ComponentType<P>,
  props: P = {} as P,
  options: HydrationOptions = {}
) {

  console.log("[@dockview/react-ssr] Hydrating app", App.name);

  const { rootElement = document.getElementById('root'), onHydrated } = options;

  if (!rootElement) {
    throw new Error('Root element not found for hydration');
  }

  const root = hydrateRoot(
    rootElement,
    createElement(App, props)
  );

  if (onHydrated) {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => {
        console.log("[@dockview/react-ssr] App hydrated");
        onHydrated();
      });
    } else {
      setTimeout(onHydrated, 0);
    }
  }

  return root;
}