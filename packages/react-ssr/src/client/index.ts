import React from 'react';
import { hydrateRoot } from 'react-dom/client';

export * from "~/server/factory";

export interface HydrationOptions {
  rootElement?: HTMLElement;
  onHydrated?: () => void;
}

export function hydrateApp<P extends object = {}>(
  App: React.ComponentType<P>,
  props: P = {} as P,
  options: HydrationOptions = {}
) {

  const { rootElement = document.getElementById('root'), onHydrated } = options;

  if (!rootElement) {
    throw new Error('Root element not found for hydration');
  }

  console.log("Hydrating app", App, props);

  const root = hydrateRoot(
    rootElement,
    React.createElement(App, props)
  );

  if (onHydrated) {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => onHydrated());
    } else {
      setTimeout(onHydrated, 0);
    }
  }

  return root;
}