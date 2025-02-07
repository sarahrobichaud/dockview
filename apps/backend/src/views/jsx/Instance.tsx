import { Eye, LoaderCircle } from "@dockview/ui/components/icons/index"
import { MainHeading, SecondaryHeading, TypoLead } from "@dockview/ui/typography"

export const InstanceView = ({ URL }: { URL: string }) => {
    return (
        <div className="">
            <div className="absolute px-8 top-0 left-0 bg-card text-card-foreground right-0 flex h-[40px] justify-between items-center">
                <span className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">sarahrobichaud.dev/<span className="text-primary">dockview</span></span>
                <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span id="view-count" className="animate-spin">x</span>
                </div>
            </div>
            <iframe src={`${URL}/instance`} className="h-[calc(100vh)] pt-[40px] w-screen min-h-full"></iframe>
        </div>
    )
}