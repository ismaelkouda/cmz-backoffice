export enum HistoryValueType {
    TEXT = 'text',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    DATE = 'date',
    OBJECT = 'object',
    ARRAY = 'array',
    NULL = 'null',
}

export function detectValueType(value: unknown): HistoryValueType {
    if (value === null) {
        return HistoryValueType.NULL;
    }

    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        return HistoryValueType.DATE;
    }

    if (typeof value === 'string') {
        return HistoryValueType.TEXT;
    }
    if (typeof value === 'number') {
        return HistoryValueType.NUMBER;
    }
    if (typeof value === 'boolean') {
        return HistoryValueType.BOOLEAN;
    }
    if (Array.isArray(value)) {
        return HistoryValueType.ARRAY;
    }
    if (typeof value === 'object') {
        return HistoryValueType.OBJECT;
    }

    return HistoryValueType.TEXT;
}
