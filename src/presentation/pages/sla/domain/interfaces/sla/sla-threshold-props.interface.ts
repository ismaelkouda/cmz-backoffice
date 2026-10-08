import {
    ThresholdType,
    ThresholdValue,
} from '@pages/sla/domain/types/sla/sla-threshold.types';

export interface SlaThresholdProps {
    id: string | number;
    slaId: string | number;
    slaType: string;
    slaName: string;
    slaDescription: string;
    slaCategory: string;
    reportTypeId: string | number | null;
    reportTypeCode: string;
    reportTypeName: string;
    threshold: ThresholdValue;
    thresholdType: ThresholdType;
    thresholdLabel: string;
    criticalThreshold: ThresholdValue;
    criticalThresholdType: ThresholdType;
    criticalThresholdLabel: string;
    unit: string;
    channel: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}
