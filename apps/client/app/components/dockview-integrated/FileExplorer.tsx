import { Button } from "@dockview/ui/components/shad-ui/button";
import { cn } from "@dockview/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type FileExplorerProps = {
    expanded: boolean;
    onToggle: () => void;
} & React.HTMLAttributes<HTMLDivElement>;
export default function FileExplorer({ expanded, onToggle, ...props }: FileExplorerProps) {

    return (
        <div className={cn("p-4 h-full", props.className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm">File Explorer</span>
                    <Button variant={"outline"} onClick={onToggle}>
                        {expanded ? <ChevronLeft /> : <ChevronRight />}
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-md">
                    <span className="text-sm">📁 src</span>
                </div>
                <div className="pl-4">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-md">
                        <span className="text-sm">📁 components</span>
                    </div>
                    <div className="pl-4">
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-md">
                            <span className="text-sm">📄 Button.tsx</span>
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-md">
                            <span className="text-sm">📄 Card.tsx</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-md">
                        <span className="text-sm">📁 pages</span>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-md">
                        <span className="text-sm">📁 utils</span>
                    </div>
                </div>
            </div>
        </div>
    )
}