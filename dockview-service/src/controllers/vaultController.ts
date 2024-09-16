import { vaultReader } from "~/server";
import { TypedRequestHandler } from "~/types/response";

type AllProjects = ReturnType<typeof vaultReader.readAllProjects>;
type GetAllProjectsHandler = TypedRequestHandler<NonNullable<AllProjects["0"]>>;

export const getAllProjects: GetAllProjectsHandler = async (_req, res) => {
  const [data, err] = vaultReader.readAllProjects();

  if (err) {
    res.status(500);

    res.json({
      success: false,
      message: err.message,
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
