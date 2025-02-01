#!/bin/bash

# Script to monitor the backend service and trigger cleanup when it stops

service_id=$(docker ps | grep "dockview-service" | awk '{print $1}')

echo "Service ID: $service_id"

cleanup_dockview_containers() {
  # Find all container IDs with the image tag :dockview
  containers=$(docker ps | grep ":dockview" | awk '{print $1}')

  # Check if any containers were found
  if [ -z "$containers" ]; then
    echo "No containers with the image tag :dockview are running."
  else
    # Stop the containers
    echo "Stopping containers with the image tag :dockview..."
    docker stop $containers

    # Remove the containers
    echo "Removing containers with the image tag :dockview..."
    docker rm $containers

    echo "All containers with the image tag :dockview have been stopped and removed."
  fi
}

# Monitor Docker events and trigger cleanup when the backend service stops
docker events --filter "event=stop" --filter "container=$service_id" | while IFS= read -r event
do
  echo "Received event: $event"
  if echo "$event" | grep -q "container stop"; then
    echo "Backend service stopped. Running cleanup."
    cleanup_dockview_containers
  fi
done

