export enum HistoryEventType {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    EVENT = 'EVENT',
    UNKNOWN = 'UNKNOWN',
}

export const EVENT_TYPE_TO_API: Record<HistoryEventType, string> = {
    [HistoryEventType.CREATE]: 'Création',
    [HistoryEventType.UPDATE]: 'Mise à jour',
    [HistoryEventType.DELETE]: 'Suppression',
    [HistoryEventType.EVENT]: 'Évèvement',
    [HistoryEventType.UNKNOWN]: 'Inconnu',
};

export const API_TO_EVENT_TYPE: Record<string, HistoryEventType> = {
    Création: HistoryEventType.CREATE,
    'Mise à jour': HistoryEventType.UPDATE,
    Suppression: HistoryEventType.DELETE,
    Évèvement: HistoryEventType.EVENT,
};

export function mapToHistoryEventType(value: string | null): HistoryEventType {
    if (!value) {
        return HistoryEventType.UNKNOWN;
    }
    return API_TO_EVENT_TYPE[value] ?? HistoryEventType.UNKNOWN;
}

export function getEventSeverity(
    type: HistoryEventType
): 'success' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (type) {
        case HistoryEventType.CREATE:
            return 'success';
        case HistoryEventType.UPDATE:
            return 'warning';
        case HistoryEventType.DELETE:
            return 'danger';
        case HistoryEventType.EVENT:
            return 'contrast';
        default:
            return 'info';
    }
}

export function getEventLabelKey(type: HistoryEventType): string {
    switch (type) {
        case HistoryEventType.CREATE:
            return 'HISTORY.EVENT.CREATE';
        case HistoryEventType.UPDATE:
            return 'HISTORY.EVENT.UPDATE';
        case HistoryEventType.DELETE:
            return 'HISTORY.EVENT.DELETE';
        case HistoryEventType.EVENT:
            return 'HISTORY.EVENT.EVENT';
        default:
            return 'HISTORY.EVENT.UNKNOWN';
    }
}
