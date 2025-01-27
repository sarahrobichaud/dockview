import Docker from "dockerode";

const docker = new Docker(); // Assuming Docker is running locally

export async function stopAndRemoveContainerByID(id: string) {
  try {
    // Get the container by its name
    const container = docker.getContainer(id);

    // Stop the container
    console.log(`Stopping container ${id}...`);
    await container.stop();

    console.log(`Container ${id} stopped.`);

    // Remove the container (optional)
    console.log(`Removing container ${id}...`);
    await container.remove();
    console.log(`Container ${id} removed.`);
  } catch (err) {
    console.error(`Error stopping/removing container ${id}:`, err);
  }
}