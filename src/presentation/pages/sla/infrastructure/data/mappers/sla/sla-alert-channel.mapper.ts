import {
    SlaAlertChannelApiDto,
    SlaAlertContactItemApiDto,
} from '@pages/sla/infrastructure/api/dto/sla/sla-alert-channel-response-api.dto';
import {
    SlaAlertChannelEntity,
    SlaAlertContactEntity,
} from '@pages/sla/domain/entities/sla/sla-alert-contact.entity';

export class SlaAlertChannelMapper {
    mapChannel(dto: SlaAlertChannelApiDto): SlaAlertChannelEntity {
        return {
            id: dto.id,
            code: dto.code,
            name: dto.name,
            enabled: dto.enabled,
        };
    }

    map(dto: SlaAlertContactItemApiDto): SlaAlertContactEntity {
        const channels = dto.channels.map((channel) =>
            this.mapChannel(channel)
        );
        const enabled = (code: string): boolean =>
            channels.find((channel) => channel.code === code)?.enabled ?? false;

        return {
            id: dto.id,
            type: dto.type,
            channels,
            email: enabled('email'),
            sms: enabled('sms'),
            whatsapp: enabled('whatsapp'),
            telegram: enabled('telegram'),
        };
    }
}
