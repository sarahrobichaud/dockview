import { analyzeProject } from "~/middlewares/analysis.middleware.js";
import { AppContext } from "~/infrastructure/BaseRouter.js";

export const projectRequestPipeline = (ctx: AppContext) => [
    analyzeProject(ctx),
]