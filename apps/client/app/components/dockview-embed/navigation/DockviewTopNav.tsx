import React from "react";
import { useDockview } from "../../../contexts/DockviewContext.js";
import clsx from "clsx";
import { X } from "lucide-react";

export default function RenderBayTopNav() {
  const { activeVersion, selectVersion, versions, selectFile, showExplorer } =
    useDockview();

  return (
    <div className="bg-charcoal px-8 min-h-[20%] max-h-[20%] relative flex items-end">
      <div className="w-full">
        <div className="flex gap-2 items-center py-4">
          <img
            className="h-[40px] object-contain my-0"
            src="/assets/brand/logo-white.svg"
            alt=""
          />
          <span className="text-3xl font-sh-serif text-white inline-block">
            Dock<span className="text-3xl font-normal font-sh-serif">view</span>
          </span>
        </div>
        <div className="flex justify-between w-full mb-4">
          <div
            className={clsx(
              "md:hidden block relative border border-gray-400 rounded-md",
              {
                'after:absolute after:content-["▼"] after:top-[25%] after:right-[10px] after:text-white':
                  true,
              }
            )}
          >
            <select
              name=""
              id=""
              className="px-8 pr-16 py-2 w-full bg-charcoal text-white rounded-md"
              onChange={(e) => selectVersion(e.target.value)}
            >
              {versions.map((version) => {
                return (
                  <option
                    value={version}
                    className={clsx(
                      "px-4 py-2 bg-charcoal text-white border-gray-200 border-2  rounded-md opacity-50 hover:opacity-100",
                      {
                        "bg-gray-200 !text-charcoal !opacity-100":
                          version === activeVersion,
                      }
                    )}
                    key={version}
                  >
                    v{version}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="gap-2 hidden md:flex">
            {versions.map((version) => {
              return (
                <button
                  className={clsx(
                    "px-4 py-2 bg-charcoal text-white border-gray-200 border-2  rounded-md opacity-50 hover:opacity-100",
                    {
                      "bg-gray-200 !text-charcoal !opacity-100":
                        version === activeVersion,
                    }
                  )}
                  onClick={() => selectVersion(version)}
                  key={version}
                >
                  V{version}
                </button>
              );
            })}
          </div>
          {/* {!!activeFile && !!showExplorer && (
            <button
              className={clsx(
                "px-4 py-2 bg-charcoal text-white border-gray-200 border-2  rounded-md opacity-50 hover:opacity-100"
              )}
              onClick={() => selectFile(null)}
            >
              <X />
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
}
