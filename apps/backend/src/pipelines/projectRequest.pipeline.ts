import { analyzeProject } from "~/middlewares/analysis.middleware";

export const projectRequestPipeline = [
    analyzeProject,
]