import WSConfig from "./ws-config";
import { DockviewClient } from "dockview-ws/client";

const client = new DockviewClient(WSConfig.URL_DEV);
