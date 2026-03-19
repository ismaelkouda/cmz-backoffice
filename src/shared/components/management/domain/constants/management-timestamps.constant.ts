import { ManagementTimestamp } from '@shared/components/management/domain/interfaces/management-timestamps.interface';

export const MANAGEMENT_TIMESTAMP: ManagementTimestamp[] = [
    {
        key: 'createdAt',
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
        key: 'confirmedAt',
        key1: 'abandonedAt',
        key2: 'processedAt',
        label: 'MANAGEMENT.STATUS.FINALIZATION',
        timestamp: null,
    },
    {
        key: 'finalizedAt',
        label: 'MANAGEMENT.STATUS.CLOSURE',
        timestamp: null,
    },
];
