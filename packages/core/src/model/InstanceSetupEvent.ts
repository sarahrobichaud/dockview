import { Mappable } from "../mappers/MapperProvider.js";
import { InstanceSetupEventPublicDTO } from "./DTOs/DockviewInstanceDTOs.js";

export type InstanceSetupEventType = "error" | "warning" | "info" | "event";

export class InstanceSetupEvent extends Error implements Mappable<InstanceSetupEventPublicDTO> {
    private _reason: string;
    private _type: InstanceSetupEventType;
    private _timestamp: string;

    constructor(message: string, reason?: string, type: InstanceSetupEventType = "event") {
        super(message);
        this._reason = reason ?? "";
        this._type = type;
        this._timestamp = new Date().toISOString();
    }

    public toPublicDTO(): InstanceSetupEventPublicDTO {
        console.log("toPublicDTO");
        return {
            display: this.toString(),
            timestamp: this.timestamp
        }
    }

    public get reason(): string {
        return this._reason;
    }

    public get type(): InstanceSetupEventType {
        return this._type;
    }

    public get message(): string {
        return this.message;
    }

    public override toString(): string {
        return `[Dockview ${this._timestamp}] ${this._type}: ${this.message}`
    }

    public get timestamp(): string {
        return this._timestamp;
    }
}

