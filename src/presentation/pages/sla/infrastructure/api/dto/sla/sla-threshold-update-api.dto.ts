export interface SlaThresholdUpdateApiDto {
    id: string | number;
    sla_id: string | number;
    threshold: string;
    critical_threshold: string;
}
