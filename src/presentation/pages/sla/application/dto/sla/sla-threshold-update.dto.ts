export interface SlaThresholdUpdateDto {
    id: string | number;
    slaId: string | number;
    threshold: string;
    criticalThreshold: string;
}
