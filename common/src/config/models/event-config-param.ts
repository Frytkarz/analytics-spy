
/**
 * Describes how to handle param
 */
export interface EventConfigParam {
    /**
     * Agregation type, might be any mathjs method that take array as param or 'array'
     */
    agregation: 'array' | 'mad' | 'max' | 'mean' | 'median' | 'min' | 'mode' | 'prod' | 'std' | 'sum' | 'var';
}