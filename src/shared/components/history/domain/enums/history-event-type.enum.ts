export enum HistoryEventType {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    EVENT = 'EVENT',
    UNKNOWN = 'UNKNOWN',
}

export function mapToHistoryEventType(value: string | null): HistoryEventType {
    if (!value) {
        return HistoryEventType.UNKNOWN;
    }

    const normalized = value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    switch (normalized) {
        case 'creation':
            return HistoryEventType.CREATE;
        case 'mise a jour':
            return HistoryEventType.UPDATE;
        case 'suppression':
            return HistoryEventType.DELETE;
        default:
            return HistoryEventType.UNKNOWN;
    }
}
