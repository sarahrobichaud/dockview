import "@remix-run/server-runtime";

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    dockview: {
      INTERNAL_ADDRESS: string;
      PUBLIC_ADDRESS: string;
    };
  }
}
