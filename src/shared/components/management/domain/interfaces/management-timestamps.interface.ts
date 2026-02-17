import { ManagementTimestampKey } from '@shared/components/management/domain/types/management-timestamps.type';

export interface ManagementTimestamp {
    key: ManagementTimestampKey;
    key1?: ManagementTimestampKey;
    key2?: ManagementTimestampKey;
    key3?: ManagementTimestampKey;
    label?: string;
    timestamp?: string | null;
}
