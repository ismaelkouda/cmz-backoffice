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
    translate: (key: string) => string,
    transformKey: 'toLowerCase' | 'toUpperCase' = 'toLowerCase'
): {
    label: string;
    value: string;
}[] {
    return Object.entries(e).map(([key, translationKey]) => ({
        label: translate(translationKey),
        value:
            transformKey === 'toLowerCase'
                ? key.toLowerCase()
                : key.toUpperCase(),
    }));
}

export function getEnumKeyByValue<T extends object>(
    enumObj: T,
    value: string,
    transformKey: 'toLowerCase' | 'toUpperCase' = 'toLowerCase'
): string | undefined {
    const foundKey = Object.keys(enumObj).find(
        (key: string) => enumObj[key as keyof T] === value
    );

    if (foundKey && transformKey) {
        return transformKey === 'toLowerCase'
            ? foundKey.toLowerCase()
            : foundKey.toUpperCase();
    }

    return foundKey;
}
