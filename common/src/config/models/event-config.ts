import { EventConfigParam } from "./event-config-param";

/**
 * Describes what and how handle event
 */
export interface EventConfig {
    /**
     * Display name that is use by map view
     */
    displayName: string;
    /**
     * Describes if and how to handle valueInUSD event field
     */
    valueInUSD?: EventConfigParam;
    /**
     * Map of param key to EventParamConfig
     */
    params?: {
        [name: string]: EventConfigParam;
    };
}