export enum HistoryChangeType {
    ADDED = 'added',
    REMOVED = 'removed',
    UPDATED = 'updated',
    UNCHANGED = 'unchanged',
}

export function resolveChangeType(
    before: unknown,
    after: unknown
): HistoryChangeType {
    const normalize = (value: unknown) =>
        typeof value === 'string' ? value.trim() : value;

    const b = normalize(before);
    const a = normalize(after);

    if (b === null && a !== null) {
        return HistoryChangeType.ADDED;
    }

    if (b !== null && a === null) {
        return HistoryChangeType.REMOVED;
    }

    if (JSON.stringify(b) !== JSON.stringify(a)) {
        return HistoryChangeType.UPDATED;
    }

    return HistoryChangeType.UNCHANGED;
}

export function getChangeStyle(
    type: HistoryChangeType
): 'success' | 'warning' | 'danger' | 'secondary' {
    switch (type) {
        case HistoryChangeType.ADDED:
            return 'success';
        case HistoryChangeType.UPDATED:
            return 'warning';
        case HistoryChangeType.REMOVED:
            return 'danger';
        default:
            return 'secondary';
    }
}

export function getChangeLabelKey(type: HistoryChangeType): string {
    console.log('type: ', type);
    switch (type) {
        case HistoryChangeType.ADDED:
            return 'HISTORY.CHANGE.ADDED';
        case HistoryChangeType.REMOVED:
            return 'HISTORY.CHANGE.REMOVED';
        case HistoryChangeType.UPDATED:
            return 'HISTORY.CHANGE.UPDATED';
        default:
            return 'HISTORY.CHANGE.UNCHANGED';
    }
}
