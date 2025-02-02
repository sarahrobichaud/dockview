import { Request, RequestHandler } from "express";
import express from "express";
import {
  DockviewServerContainer,
  DockviewStaticContainer,
} from "~/models/Container";
import { ContainerStatus } from "~/types/containerStatus.enum";
import httpProxy from "http-proxy";
import { container } from "tsyringe";
import { InstanceManagerContract } from "~/lib/instance-manager/InstanceManagerContract";
import { TOKENS } from "~/tokens";
import { DockviewServerInstance } from "@dockview/core/models";

export const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: false,
  selfHandleResponse: false,
});


export const projectProxyHandler: RequestHandler = async (req, res, next) => {
  console.log("-------------- projectProxyHandler --------------");

  const subdomain = req.hostname.split(".")[0];

  // Extract projectName, version, and containerID from the subdomain
  // Assuming subdomain format: projectName--version--containerID
  const [prefix, containerID] = subdomain.split("--");

  const secFetchSite = req.headers["sec-fetch-site"];

  // Protect route
  if (secFetchSite !== "same-origin") {
    // Deny the request
    console.log("Forbidden" + req.hostname);
    res.redirect("/");
    // res.status(403).send("Forbidden");
  }

  if (prefix !== "dv") {
    res.status(400).send("Invalid subdomain.");
  }

  if (!containerID) {
    res.status(400).send("Container ID not provided.");
  }

  console.log("Container ID:", containerID);

  // Check if the containerID is valid
  const instanceManager = container.resolve<InstanceManagerContract>(TOKENS.InstanceManager);
  const instance = instanceManager.getByID(containerID);

  if (!instance) {
    return res.status(404).send("Container not found.");
  }

  if (!container) {
    return res.status(404).send("Container not found.");
  }

  instance.updateLastAccessed();

  if (instance instanceof DockviewServerInstance && instance.container) {
    const container = instance.container;
    // Not implemented yet
    console.log("-------------- is server --------------");

    if (instance.status !== ContainerStatus.TRANSITION) {
      res.render("launching");
      return;
    }
    const { ip, port } = await container.getNetworkInfo();

    proxy.web(req, res, {
      target: `http://${ip}:${port}`,
      changeOrigin: true,
      ws: false,
    });
    return;
  }

  console.log("------------- is static ------------");

  if (container instanceof DockviewStaticContainer) {
    console.log({ path: container.path });
    express.static(container.path)(req, res, next);
  }
};
