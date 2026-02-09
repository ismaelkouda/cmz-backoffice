import { TemplateRef } from '@angular/core';

export type FilterFieldType =
    | 'text'
    | 'select'
    | 'multi-select'
    | 'date'
    | 'date-range'
    | 'template';

export interface FilterField {
    type: FilterFieldType;
    name: string;
    label: string;
    placeholder?: string;
    options?: any[] | readonly any[];
    loading?: boolean;
    optionLabel?: string;
    optionValue?: string;
    class?: string;
    showClear?: boolean;
    showToggleAll?: boolean;
    filter?: boolean;
    template?: TemplateRef<any>;
}

export interface FilterOption {
    label: string;
    value: string | number | boolean;
}

export function enumToFilterOptions<T extends Record<string, string>>(
    e: T,
    translate: (key: string) => string
) {
    return Object.entries(e).map(([key, translationKey]) => ({
        label: translate(translationKey),
        value: key.toLowerCase(),
    }));
}
