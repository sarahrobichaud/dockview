import React, { useEffect, useRef, useState } from "react";

import Dockview from "./Dockview";
import { useFetchModulePaths } from "../../hooks/useFetchPaths";

import "./styles/main.css";

export default function App() {
  const project = "random-demos";

  const [paths, loading] = useFetchModulePaths(project);

  return (
    <div className="relative bg-gray-100 flex flex-col gap-8 py-16 h-screen">
      <div className="fixed flex items-center justify-center bg-red inset-0 pointer-events-none"></div>
      {/* // TODO Handle side bar sizing here */}
      <div className="mx-auto w-full max-w-[50%]">
        <div className="flex items-end justify-between">
          <div>
            <h1>Live Demo</h1>
          </div>
          <p className="text-xl my-2">
            Made with 💖 by{" "}
            <a
              href="https://github.com/sarahrobichaud"
              className="font-bold underline hover:text-pink-500 transition"
            >
              Sarah R.
            </a>
          </p>
        </div>
        <div className="">
          {!loading && <Dockview project="vite-ssr-demo" />}
          {/* <DemoTool /> */}
        </div>
        <p className="text-right">Version 1.0.0-alpha</p>
      </div>
    </div>
  );
}
// export default function App() {
//   return <DemoTool />;
// }

// const DemoTool = () => {
//   const [project, setProject] = useState("chromabay");
//   const [version, setVersion] = useState("v0.0.1");

//   return (
//     <div>
//       <h1>Demo Tool</h1>

//       {/* You can replace this with a more dynamic project/version selector */}
//       <div>
//         <label>
//           Select Project:
//           <select value={project} onChange={(e) => setProject(e.target.value)}>
//             <option value="chromabay">Chromabay</option>
//           </select>
//         </label>

//         <label>
//           Select Version:
//           <select value={version} onChange={(e) => setVersion(e.target.value)}>
//             <option value="v0.0.1">v0.0.1</option>
//             <option value="v0.0.2">v0.0.2</option>
//             <option value="v0.0.3">v0.0.3</option>
//           </select>
//         </label>
//       </div>

//       {/* Render the BuildViewer component */}
//       <BuildViewer project={project} version={version} />
//     </div>
//   );
// };

// const BuildViewer = ({ project, version }) => {
//   const iframeRef = useRef<HTMLIFrameElement>(null);

//   useEffect(() => {
//     const iframe = iframeRef.current;
//     const buildPath = `/demos/${project}/${project}-${version}/build/`;
//     const indexUrl = `${buildPath}index.html`;

//     if (iframe) {
//       iframe.src = indexUrl; // Set the iframe source

//       const onLoad = () => {
//         const iframeDoc =
//           iframe.contentDocument || iframe.contentWindow?.document;

//         if (iframeDoc) {
//           // Ensure the base tag is the first element in the head
//           let base = iframeDoc.querySelector("base");
//           if (!base) {
//             base = iframeDoc.createElement("base");
//             iframeDoc.head.append(base);
//           }
//           base.href = buildPath.substring(0, buildPath.length - 1);
//         }
//       };

//       // Attach onload event to set the base tag
//       iframe.addEventListener("load", onLoad);

//       // Cleanup the event listener on unmount
//       return () => {
//         iframe.removeEventListener("load", onLoad);
//       };
//     }
//   }, [project, version]);

//   return (
//     <div>
//       <h2>
//         Viewing {project} - {version}
//       </h2>
//       <iframe
//         ref={iframeRef}
//         title={`${project}-${version}`}
//         style={{ width: "100%", height: "500px", border: "none" }}
//       />
//     </div>
//   );
// };
