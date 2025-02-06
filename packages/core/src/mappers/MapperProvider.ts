import { DockviewInstance } from "../model/DockviewInstance";


export interface Mappable<TPublicDTO> {
    toPublicDTO(): TPublicDTO;
}