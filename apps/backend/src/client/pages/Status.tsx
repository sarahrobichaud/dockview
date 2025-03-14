import { DockviewInstancePublicDTO } from "@dockview/core/models"
import { LoaderCircle } from "@dockview/ui/icons";
import { MainHeading, TypoLead } from "@dockview/ui/typography";

export type StatusViewProps = {
    status: string;
}

export function isStatusViewProps(props: unknown): props is StatusViewProps {
    if (!props || typeof props !== 'object') {
        return false;
    }

    const candidate = props as Record<string, unknown>;

    return typeof candidate.status === 'string';
}

export const StatusView = ({ status }: StatusViewProps) => {
    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
            <MainHeading className="">Getting Things Ready</MainHeading>
            <TypoLead className="flex items-center gap-2">
                <LoaderCircle className="animate-spin text-primary" />
                <span id="instance-status">{status}</span>
            </TypoLead>
            <pre id="instance-log" className="bg-card text-card-foreground p-4 rounded-md max-h-[200px] h-full max-w-[1000px] w-full overflow-y-auto">
            </pre>
        </div>
    )
}