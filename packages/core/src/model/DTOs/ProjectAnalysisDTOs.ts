import { ProjectAnalysisType, ProjectEnvironment } from "@dockview/core/shared";

export interface ProjectAnalysisPublicDTO {
    type: ProjectAnalysisType
    environment: ProjectEnvironment
    buildRequired: boolean;
}
