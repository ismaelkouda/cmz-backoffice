import { ManagementTimestamp } from '@shared/components/management/domain/interfaces/management-timestamps.interface';

export const MANAGEMENT_TIMESTAMP: ManagementTimestamp[] = [
    {
        key: 'reportedAt',
        label: 'MANAGEMENT.STATUS.SUBMISSION',
        timestamp: null,
    },
    {
        key: 'approvedAt',
        key1: 'rejectedAt',
        label: 'MANAGEMENT.STATUS.QUALIFICATION',
        timestamp: null,
    },
    {
        key: 'acknowledgedAt',
        label: 'MANAGEMENT.STATUS.FINALIZATION',
        timestamp: null,
    },
    {
        key: 'finalizedAt',
        label: 'MANAGEMENT.STATUS.CLOSURE',
        timestamp: null,
    },
];
