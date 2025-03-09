import { analyzeProject } from "~/middlewares/analysis.middleware";
import { AppContext } from "~/infrastructure/BaseRouter";

export const projectRequestPipeline = (ctx: AppContext) => [
    analyzeProject(ctx),
]