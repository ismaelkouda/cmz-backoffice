export enum Status {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    ABANDONED = 'abandoned',
    'IN_PROGRESS' = 'in-progress',
    TERMINATED = 'terminated',
    CONFIRMED = 'confirmed',
}

export enum StatusLabel {
    pending = 'COMMON.PENDING',
    approved = 'COMMON.APPROVED',
    rejected = 'COMMON.REJECTED',
    abandoned = 'COMMON.ABANDONED',
    'in-progress' = 'COMMON.IN_PROGRESS',
    terminated = 'COMMON.TERMINATED',
    confirmed = 'COMMON.CONFIRMED',
}

export enum StatusStyle {
    APPROVED = 'COMMON.APPROVED_STYLE',
    REJECTED = 'COMMON.REJECTED_STYLE',
    ABANDONED = 'COMMON.ABANDONED_STYLE',
    'IN_PROGRESS' = 'COMMON.IN_PROGRESS_STYLE',
    TERMINATED = 'COMMON.TERMINATED_STYLE',
    CONFIRMED = 'COMMON.CONFIRMED_STYLE',
    PENDING = 'COMMON.PENDING_STYLE',
}
