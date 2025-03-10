import { DockviewInstancePublicDTO } from "@dockview/core/models"
import { LoaderCircle } from "@dockview/ui/icons";
import { MainHeading, TypoLead } from "@dockview/ui/typography";

export type StatusViewProps = {
    test: string;
}

export const StatusView = ({ test }: StatusViewProps) => {
    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
            <MainHeading className="">Getting Things Ready</MainHeading>
            <TypoLead className="flex items-center gap-2">
                <LoaderCircle className="animate-spin text-primary" />
                <span id="instance-status">{test}</span>
            </TypoLead>
            <pre id="instance-log" className="bg-card text-card-foreground p-4 rounded-md max-h-[200px] h-full max-w-[1000px] w-full overflow-y-auto">
            </pre>
        </div>
    )
}