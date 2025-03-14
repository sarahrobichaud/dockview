import DockviewApp from "../components/Dockview.js";

export type InstanceViewProps = {
    URL: string;
    name: string;
}

export function isInstanceViewProps(props: unknown): props is InstanceViewProps {

    if (!props || typeof props !== 'object') {
        return false;
    }

    const candidate = props as Record<string, unknown>;

    return (
        typeof candidate.URL === 'string' &&
        typeof candidate.name === 'string'
    );
}


export const InstanceView = ({ URL: initialURL, name }: InstanceViewProps) => {
    return (
        <div className="overflow-x-hidden">
            <DockviewApp backendURL={initialURL} name={name} />
        </div>
    )
}