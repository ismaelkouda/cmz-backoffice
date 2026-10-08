import {
    ThresholdType,
    ThresholdValue,
} from '@pages/sla/domain/types/sla/sla-threshold.types';

export interface SlaThresholdsVmProps {
    id: string | number;
    slaId: string | number;
    slaType: string;
    slaTypeLabel: string;
    slaName: string;
    description: string;
    slaCategoryLabel: string;
    threshold: ThresholdValue;
    thresholdType: ThresholdType;
    thresholdLabel: string;
    criticalThreshold: ThresholdValue;
    criticalThresholdType: ThresholdType;
    criticalThresholdLabel: string;
    channel: string;
    channelLabel: string;
    createdAt: string;
    updatedAt: string;
}
