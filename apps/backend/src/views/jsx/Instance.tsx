import { LoaderCircle } from "@dockview/ui/components/icons/index"
import { MainHeading, TypoLead } from "@dockview/ui/typography"

export const InstanceView = ({ URL }: { URL: string }) => {
    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
            <MainHeading className="">Instance</MainHeading>
            <TypoLead>Active Connections: <span id="view-count" className="animate-spin">x</span></TypoLead>

            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero, neque incidunt nihil ipsam earum voluptatem itaque? Iusto rem praesentium non?</p>
            <iframe src={`${URL}/instance`} className="w-screen h-screen min-h-full pb-[40px]"></iframe>
        </div>
    )
}