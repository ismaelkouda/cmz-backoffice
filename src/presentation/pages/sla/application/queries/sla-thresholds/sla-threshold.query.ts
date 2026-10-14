import { SlaThresholdFilterDto } from '@pages/sla/application/dto/sla/sla-threshold-filter.dto';

export class SlaThresholdQuery {
    constructor(
        public readonly slaType?: string,
        public readonly channel?: string
    ) {}

    static fromDto(dto: SlaThresholdFilterDto): SlaThresholdQuery {
        return new SlaThresholdQuery(dto.slaType, dto.channel);
    }
}

export class SlaChannelOptionsQuery {
    readonly type = 'channel-options' as const;
}
