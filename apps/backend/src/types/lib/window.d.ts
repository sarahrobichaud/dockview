import { StatusViewProps } from "../../client/pages/Status";
import { InstanceViewProps } from "../../client/pages/Instance";

declare global {
    interface Window {
        __INITIAL_STATE__: StatusViewProps | InstanceViewProps;
        __INIT_WS__: () => void;
        __HYDRATED__: boolean;
    }
}