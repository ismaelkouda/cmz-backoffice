import { SlaThresholdQuery } from '@pages/sla/application/queries/sla-thresholds/sla-threshold.query';
import { SlaThresholdFilterContract } from '@pages/sla/domain/contracts/sla/sla-threshold-filter.contract';

export const slaThresholdQueryMapper = (
    query: SlaThresholdQuery
): SlaThresholdFilterContract => ({
    slaType: query.slaType,
    channel: query.channel,
});
