import { SlaThresholdFilterContract } from '@pages/sla/domain/contracts/sla/sla-threshold-filter.contract';
import { SlaThresholdFilterEntity } from '@pages/sla/domain/entities/sla/sla-threshold-filter.entity';

export const slaThresholdFilterVo = (
    contract: SlaThresholdFilterContract
): SlaThresholdFilterEntity =>
    new SlaThresholdFilterEntity(contract.slaType, contract.channel);
