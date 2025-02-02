import { ContainerStatusKey } from "@dockview/core/enums";
import { LimitedProjectAnalysis, ProjectAnalysis, ProjectQueryWithAnalysis } from "@dockview/core/shared";
import { ProjectAnalysisPublicDTO } from "./ProjectAnalysisDTOs";

export interface DockviewInstancePublicDTO {
    id: string;
    type: string;
    status: ContainerStatusKey
    logs: InstanceSetupInfoPublicDTO;
    project: {
        name: string;
        path: string;
        analysis: ProjectAnalysisPublicDTO;
    }
    activeConnections: number;
}

export interface InstanceSetupEventPublicDTO {
    message: string;
    reason: string;
    display: string;
    type: string;
    timestamp: string;
}


export interface InstanceSetupInfoPublicDTO {
    currentStep: string | null;
    events: InstanceSetupEventPublicDTO[];
    errors: InstanceSetupEventPublicDTO[];
    warnings: InstanceSetupEventPublicDTO[];
    info: InstanceSetupEventPublicDTO[];
}
