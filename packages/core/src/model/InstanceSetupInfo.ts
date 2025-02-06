import { Mappable } from "../mappers/MapperProvider";
import { InstanceSetupInfoPublicDTO } from "./DTOs/DockviewInstanceDTOs";
import { InstanceSetupEvent } from "./InstanceSetupEvent";

export class InstanceSetupInfo implements Mappable<InstanceSetupInfoPublicDTO> {
    private _events: InstanceSetupEvent[] = [];

    private _currentStep: string | null = null;


    toPublicDTO(): InstanceSetupInfoPublicDTO {
        return {
            currentStep: this.currentStep,
            events: this.events.map(e => e.toPublicDTO()),
            errors: this.errors.map(e => e.toPublicDTO()),
            warnings: this.warnings.map(e => e.toPublicDTO()),
            info: this.info.map(e => e.toPublicDTO())
        }
    }

    /**
     * Sorted events by timestamp
     */
    public get events(): readonly InstanceSetupEvent[] {
        return Object.freeze([...this._events.sort((a, b) => a.timestamp.localeCompare(b.timestamp))]);
    }

    /**
     * Sorted errors by timestamp
     */
    public get errors(): readonly InstanceSetupEvent[] {
        return Object.freeze([...this.events.filter(e => e.type === 'error')]);
    }

    /**
     * Sorted warnings by timestamp
     */
    public get warnings(): readonly InstanceSetupEvent[] {
        return Object.freeze([...this.events.filter(e => e.type === 'warning')]);
    }

    /**
     * Sorted info by timestamp
     */
    public get info(): readonly InstanceSetupEvent[] {
        return Object.freeze([...this.events.filter(e => e.type === 'info')]);
    }

    /**
     * The last event message
     */
    public get currentStep(): string | null {
        return this.info[this.info.length - 1]?.message ?? null;
    }

    public logEvent(message: string, reason?: string): void {
        console.log("logEvent", message, reason);
        this._events.push(new InstanceSetupEvent(message, reason, 'event'));
    }

    public logError(message: string, reason?: string): void {
        console.log("logError", message, reason);
        this._events.push(new InstanceSetupEvent(message, reason, 'error'));
    }

    public logWarning(message: string, reason?: string): void {
        console.log("logWarning", message, reason);
        this._events.push(new InstanceSetupEvent(message, reason, 'warning'));
    }

    public logInfo(message: string, reason?: string): void {
        console.log("logInfo", message, reason);
        this._events.push(new InstanceSetupEvent(message, reason, 'info'));
    }
}

