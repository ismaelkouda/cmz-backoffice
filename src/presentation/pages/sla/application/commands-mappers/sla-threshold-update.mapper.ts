import { SlaThresholdUpdateCommand } from '@pages/sla/application/commands/sla-thresholds/sla-threshold-update.command';
import { SlaThresholdUpdateContract } from '@pages/sla/domain/contracts/sla/sla-threshold-update.contract';

export const slaThresholdUpdateMapper = (
    command: SlaThresholdUpdateCommand
): SlaThresholdUpdateContract => ({
    id: command.id,
    slaId: command.slaId,
    threshold: command.threshold,
    criticalThreshold: command.criticalThreshold,
});
