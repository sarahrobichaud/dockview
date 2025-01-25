import fs from "fs";
import path from "path";
import Docker from "dockerode";
import tar from "tar-fs";

const docker = new Docker();

export function saveDockerfile(directory: string, fileName: string, contents: string) {
  // Ensure output directory exists
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  // Write the Dockerfile
  const filePath = path.join(directory, fileName);
  fs.writeFileSync(filePath, contents);

  console.log(`Dockerfile generated at ${filePath}`);
}

export async function createNetwork(name: string) {
  try {
    const networks = await docker.listNetworks();
    const existingNetwork = networks.find((net: any) => net.Name === name);

    if (!existingNetwork) {
      await docker.createNetwork({
        Name: name,
        Driver: "bridge", // Use the bridge driver for a private network
      });
      console.log("Network created: " + name);
    } else {
      console.log("Network already exists: " + name);
    }
  } catch (err) {
    console.error("Error creating network:", err);
  }
}

export const buildImage = async (context: string, dockerfile: string, imageName: string) => {
  return new Promise(async (resolve, reject) => {
    // Ensure the context path is valid
    if (!fs.existsSync(context) || !fs.lstatSync(context).isDirectory()) {
      console.error("Context path is invalid or not a directory");
      process.exit(1);
    }

    const tarStream = tar.pack(context);

    const options = {
      t: imageName, // Tag the image with the specified name
      dockerfile: dockerfile, // Path to the Dockerfile
    };

    // Build the image
    docker.buildImage(tarStream, options, (err, stream) => {
      if (err || !stream) {
        console.error("Error initiating build:", err);
        reject(null);
        return;
      }

      // Attach event listeners to handle the build process
      stream.on("data", (data) => {
        const message = data.toString();
      });

      stream.on("end", () => {
        console.log("Image built successfully:", imageName);
        resolve(imageName); // Resolve the promise with the image name
      });

      stream.on("close", () => {
        console.log("Build stream closed.");
      });

      stream.on("error", (error) => {
        console.error("Stream error:", error);
        reject(error); // Reject the promise if the stream encounters an error
      });
    });
  });
};

export async function createContainer(
  containerID: string,
  image: string,
  containerName: string,
) {

  return new Promise(async (resolve, reject) => {
    // Attempt to create the container

    try {
      const mode = image.includes("dev") ? "dev" : "prod";
      const container = await docker.createContainer({
        Image: image,
        name: containerName,
        HostConfig: {
          NetworkMode: "dockview_internal",
        },
      });

      await container.start();

      const data = await container.inspect();
      const ipAddress =
        data.NetworkSettings.Networks.dockview_internal.IPAddress;

      // TODC: Deal with multiple ports
      const ports = Object.entries(data.NetworkSettings.Ports);

      let exposedPort;
      if (mode === "prod") {
        exposedPort = ports[0][0].split("/")[0];
      } else {
        exposedPort = ports[1][0].split("/")[0];
      }
      resolve({ self: container, ip: ipAddress, port: parseInt(exposedPort) });
    } catch (err) {
      reject(err);
    }
  });
}