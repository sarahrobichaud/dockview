import { hydrateRoot } from 'react-dom/client';

export function hydrateApp(App: React.ComponentType<any>, props: Record<string, any> = {}) {
  hydrateRoot(
    document,
    <App {...props} />
  );
}