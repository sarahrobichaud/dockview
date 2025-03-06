import React from "react";

export const HYDRATION_REGISTRY: Record<string, string> = {};

/**
 * Higher-order component to make a component hydratable
 * @param Component The component to make hydratable
 * @param id A unique identifier for the component
 */
export function hydratable<P extends object>(
  Component: React.ComponentType<P>,
  id: string
): React.FC<P> {
  HYDRATION_REGISTRY[id] = Component.name || 'Component';
  
  return (props: P) => {
    return (
      <div 
        id={`hydrate-${id}`} 
        data-hydrate-id={id}
        data-hydrate-props={JSON.stringify(props)}
      >
        <Component {...props} />
      </div>
    );
  };
} 