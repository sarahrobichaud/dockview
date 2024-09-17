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
    res.status(500);

    res.json({
      success: false,
      message: err.message,
      type: err.name,
      data: null,
    });

    return;
  }

  res.status(200);
  res.json({
    success: true,
    resource: data,
  });
};
