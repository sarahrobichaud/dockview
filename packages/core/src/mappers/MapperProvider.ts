import { DockviewInstance } from "../model/DockviewInstance.js";


export interface Mappable<TPublicDTO> {
    toPublicDTO(): TPublicDTO;
}