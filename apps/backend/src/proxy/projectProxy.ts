import { Request, RequestHandler } from "express";
import express from "express";
import {
  DockviewServerContainer,
  DockviewStaticContainer,
} from "~/models/Container";
import { proxy } from "~/proxy";
import { containerManager } from "~/server";
import { ContainerStatus } from "~/types/containerStatus.enum";

export const projectProxyHandler: RequestHandler = (req, res, next) => {
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
  const container = containerManager.getContainer(containerID);

  if (!container) {
    return res.status(404).send("Container not found.");
  }

  container.updateLastAccessed();

  if (container instanceof DockviewServerContainer) {
    // Not implemented yet
    console.log("-------------- is server --------------");

    if (container.status !== ContainerStatus.TRANSITION) {
      res.render("launching");
      return;
    }

    proxy.web(req, res, {
      target: `http://${container.ip}:${container.port}`,
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
