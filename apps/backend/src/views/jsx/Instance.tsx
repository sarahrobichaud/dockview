import { Eye, Plus } from "@dockview/ui/components/icons/index"
import { Button } from "@dockview/ui/components/shad-ui/button";
import { TypoLead } from "@dockview/ui/typography";
import { useEffect, useRef, useState } from "react"

export const InstanceView = ({ URL: initialURL, name }: { URL: string, name: string }) => {

    const [activePath, setActivePath] = useState('');

    const iframeRef = useRef<HTMLIFrameElement>(null);


    useEffect(() => {
        // Listen for messages from the iframe
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'navigation') {
                setActivePath(event.data.path);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <div className="">
            <div className="absolute px-8 top-0 left-0 bg-background text-background-foreground right-0 flex h-[40px] justify-between items-center">
                <span className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">sarahrobichaud.dev</span>
                <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span id="view-count" className="animate-spin">x</span>
                </div>
            </div>
            <div className="absolute px-8 top-[40px] border-border border-2 left-0 bg-card text-card-foreground right-0 flex h-[40px] justify-between items-center">
                <TypoLead>
                    <span className="text-muted-foreground">{name}</span><span className="text-primary">{activePath}</span>
                </TypoLead>
            </div>
            <iframe src={initialURL} className="h-[calc(100vh)] pt-[80px] w-screen min-h-full" ref={iframeRef}></iframe>
        </div>
    )
}