import { HttpParams } from '@angular/common/http';

export interface HttpParamsOptions {
    skipEmptyString?: boolean;
    skipNull?: boolean;
    skipUndefined?: boolean;
    arrayFormat?: 'repeat' | 'comma';
    dateSerializer?: (d: Date) => string;
}

const defaultOptions: Required<HttpParamsOptions> = {
    skipEmptyString: true,
    skipNull: true,
    skipUndefined: true,
    arrayFormat: 'repeat',
    dateSerializer: (d) => d.toISOString(),
};

type Primitive = string | number | boolean | Date;
type Value =
    | Primitive
    | Primitive[]
    | Record<string, unknown>
    | null
    | undefined;

export function buildHttpParams<T extends object>(
    payload?: T,
    options?: HttpParamsOptions
): HttpParams {
    const config = { ...defaultOptions, ...options };
    let params = new HttpParams();

    if (!payload) {
        return params;
    }

    const appendParam = (
        key: string,
        value: Primitive | Record<string, unknown> | null | undefined
    ) => {
        if (value instanceof Date) {
            params = params.append(key, config.dateSerializer(value));
        } else {
            params = params.append(key, String(value));
        }
    };

    const processEntry = (key: string, value: Value) => {
        if (value === undefined && config.skipUndefined) {
            return;
        }
        if (value === null && config.skipNull) {
            return;
        }
        if (value === '' && config.skipEmptyString) {
            return;
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                return;
            }

            if (config.arrayFormat === 'comma') {
                const serialized = value
                    .map((v) =>
                        v instanceof Date ? config.dateSerializer(v) : String(v)
                    )
                    .join(',');
                params = params.append(key, serialized);
            } else {
                value.forEach((v) => appendParam(key, v));
            }
            return;
        }

        const isPlainObject = (v: unknown): v is Record<string, unknown> =>
            typeof v === 'object' &&
            v !== null &&
            !Array.isArray(v) &&
            !(v instanceof Date);

        if (isPlainObject(value)) {
            Object.entries(value).forEach(([nestedKey, nestedValue]) =>
                processEntry(`${key}.${nestedKey}`, nestedValue as Value)
            );
            return;
        }

        appendParam(key, value);
    };

    Object.entries(payload as Record<string, Value>).forEach(([key, value]) =>
        processEntry(key, value)
    );

    return params;
}
