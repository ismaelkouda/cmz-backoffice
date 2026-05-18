export enum State {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    TERMINATED = 'terminated',
    COMPLETED = 'completed',
}

export enum StateLabel {
    pending = 'COMMON.PENDING',
    'in-progress' = 'COMMON.IN_PROGRESS',
    terminated = 'COMMON.TERMINATED',
    completed = 'COMMON.COMPLETED',
}

export enum StateStyle {
    'IN_PROGRESS' = 'COMMON.IN_PROGRESS_STYLE',
    TERMINATED = 'COMMON.TERMINATED_STYLE',
    COMPLETED = 'COMMON.COMPLETED_STYLE',
    PENDING = 'COMMON.PENDING_STYLE',
}
