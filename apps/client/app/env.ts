declare module "react-router" {
  // Your AppLoadContext used in v2
  interface AppLoadContext {
    dockview: {
      INTERNAL_ADDRESS: string;
      PUBLIC_ADDRESS: string;
    };
  }

  // TODO: remove this once we've migrated to `Route.LoaderArgs` instead for our loaders
  interface LoaderFunctionArgs {
    context: AppLoadContext;
  }

  // TODO: remove this once we've migrated to `Route.ActionArgs` instead for our actions
  interface ActionFunctionArgs {
    context: AppLoadContext;
  }
}

export {};