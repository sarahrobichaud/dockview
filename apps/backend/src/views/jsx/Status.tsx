import { DockviewInstancePublicDTO } from "@dockview/core/models"
import { LoaderCircle } from "@dockview/ui/components/icons/index";
import { MainHeading, TypoLead } from "@dockview/ui/typography";

export type StatusViewProps = {
    data: DockviewInstancePublicDTO;
}

export const StatusView = ({ data }: StatusViewProps) => {
    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
            <MainHeading className="">Getting Things Ready</MainHeading>
            <TypoLead className="flex items-center gap-2">
                <LoaderCircle className="animate-spin text-primary"/>
                {data.status}
            </TypoLead>
        </div>
    )
}