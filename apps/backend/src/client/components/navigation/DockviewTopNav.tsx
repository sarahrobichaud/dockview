import React, { useEffect, useState } from "react";
import { useDockview } from "../../contexts/DockviewContext.js";
import clsx from "clsx";
import { Eye, X } from "@dockview/ui/icons";
import { TypoLead } from "@dockview/ui/typography";
import { useAnimatedText } from "@dockview/ui/hooks";
import { Button } from "@dockview/ui/shad";

export type RenderBayTopNavProps = {
  name: string;
}

export default function RenderBayTopNav({ name }: RenderBayTopNavProps) {
  const { selectFile, showExplorer } =
    useDockview();

  const [activePath, setActivePath] = useState('');

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
    <div className="bg-background max-h-[80px] h-full">
      <div className="absolute px-8 top-0 left-0 z-[1000] bg-background text-background-foreground right-0 flex h-[40px] justify-between items-center">
        <span className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">sarahrobichaud.dev</span>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span id="view-count" className="animate-spin">x</span>
        </div>
      </div>
      <div className="absolute px-8 top-[40px] z-[1000] border-border left-0 bg-primary text-black right-0 flex h-[40px] justify-between items-center">
        <TypoLead>
          <span className="text-black font-bold">{name}</span><span className="text-black">{useAnimatedText(activePath, 40, activePath.split('').reverse().join(''))}</span>
        </TypoLead>
      </div>
    </div>
  );
}
