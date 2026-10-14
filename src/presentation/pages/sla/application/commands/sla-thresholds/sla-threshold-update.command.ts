import { SlaThresholdUpdateDto } from '@pages/sla/application/dto/sla/sla-threshold-update.dto';

export class SlaThresholdUpdateCommand {
    constructor(
        public readonly id: string | number,
        public readonly slaId: string | number,
        public readonly threshold: string,
        public readonly criticalThreshold: string
    ) {}

    static fromDto(dto: SlaThresholdUpdateDto): SlaThresholdUpdateCommand {
        return new SlaThresholdUpdateCommand(
            dto.id,
            dto.slaId,
            dto.threshold,
            dto.criticalThreshold
        );
    }
}
