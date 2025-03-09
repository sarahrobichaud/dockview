import DockviewApp from "../components/Dockview.js";

export const InstanceView = ({ URL: initialURL, name }: { URL: string, name: string }) => {
    return (
        <div className="overflow-x-hidden">
            <DockviewApp backendURL={initialURL} name={name} />
        </div>
    )
}