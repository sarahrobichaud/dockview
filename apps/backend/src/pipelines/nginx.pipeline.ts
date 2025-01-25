import { nanoid } from "nanoid";
import {
  buildImage,
  createContainer,
  createNetwork,
} from "../../containers/docker/docker-utils";
import Env from "../../containers/envs";
import path from "path";
import modes from "../../containers/modes";

export async function setupNginxEnvironment(
  containerID,
  projectName,
  versionDir,
  mode,
  broadcast
) {
  const sourceDir = path.join(versionDir, "source");

  const pathSplit = versionDir.split("/");
  const nameWithVersion = pathSplit[pathSplit.length - 1];
  // Create and run the Docker container

  return new Promise(async (resolve, reject) => {
    try {
      broadcast(`Getting things ready`);

      const imageName = await buildImage(
        sourceDir,
        `Dockerfile.${mode}`,
        `${nameWithVersion}:${mode}`,
        broadcast
      );

      await createNetwork("dockview_internal");

      const containerName = `${nameWithVersion}-${nanoid(6)}`;
      const container = await createContainer(
        containerID,
        imageName,
        containerName,
        broadcast
      );

      broadcast(`Successfully Started A Container`);
      resolve(container);
    } catch (error) {
      console.error("Pipeline error:", error);
      broadcast(`Pipeline error: ${error.message}`);
      reject(error);
    }
  });
}

export default function RequestNginxEnvironment(req, res, next) {
  const project = req.project;
  const version = req.version;

  // Serve the loading page
  res.setHeader("Content-Type", "text/html");
  res.send(`
    <html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loading...</title>
    <script defer src="http://localhost:4000/dv-client-script.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #32302F;
        }


        main {
        background-color: #32302f;
            display: flex;
            gap: 4rem;
            color: #F3F4F6;
            justify-content: center;
            align-items: center;
            height: 80vh;
            padding: 20px;
        }


        .container pre {
            font-weight: bold;
            padding: 10px;
            border-radius: 5px;
            overflow-y: auto;
            max-height: 400px;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            color: #9ca3af;
            font-size: 0.8rem;
        }
    </style>
</head>

<body data-container-id="${nanoid(
    10
  )}" data-project="${project}" data-version="${version}" data-env="${
    Env.static
  }" data-mode=${modes[req.config.mode]}>
    <main>
            <h2>Setting things up for ${project}@${version}</h2>

            <pre id="logs">Logs will appear here...</pre>
    </main>

</body>

</html>`);
}