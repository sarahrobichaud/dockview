import { vaultReader } from "~/server";
import { TypedRequestHandler, V1Response } from "~/types/response";

// Success Result
type AllProjects = NonNullable<
  ReturnType<typeof vaultReader.readAllProjects>["0"]
>;

// Handler & Public API Response
type GetAllProjectsHandler = TypedRequestHandler<AllProjects>;
export type GetAllProjectsResponse = V1Response<AllProjects>;

export const getAllProjects: GetAllProjectsHandler = async (_req, res) => {
  const [data, err] = vaultReader.readAllProjects();

  if (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      type: err.name,
      data: null,
    });

    return;
  }

  res.status(200).json({
    success: true,
    resource: data,
  });
};

// Success Result
type ProjectVersions = NonNullable<
  ReturnType<typeof vaultReader.readProjectVersions>["0"]
>;

// Handler & Public API Response
type GetProjectVersionsHandler = TypedRequestHandler<ProjectVersions>;
export type GetProjectVersionsResponse = V1Response<ProjectVersions>;

export const getProjectVersions: GetProjectVersionsHandler = async (
  _req,
  res
) => {
  const projectName = _req.params.version;

  if (!projectName) {
    res.status(400).json({
      success: false,
      message: "Project version not provided",
      type: "BadRequest",
      data: null,
    });

    return;
  }

  const [data, err] = vaultReader.readProjectVersions(projectName);

  if (err) {
    res.status(500);

    res.json({
      success: false,
      message: err.message,
      type: err.name,
      data: null,
    });

    return;
  }

  res.status(200).json({
    success: true,
    resource: data,
  });
};
