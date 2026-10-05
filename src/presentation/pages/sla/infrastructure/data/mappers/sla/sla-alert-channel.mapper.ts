import {
    SlaAlertChannelApiDto,
    SlaAlertContactItemApiDto,
} from '@pages/sla/infrastructure/api/dto/sla/sla-alert-channel-response-api.dto';
import {
    SlaAlertChannelEntity,
    SlaAlertChannelOptionEntity,
    SlaAlertContactEntity,
} from '@pages/sla/domain/entities/sla/sla-alert-contact.entity';
import { SlaAlertChannelUpdateContract } from '@pages/sla/domain/contracts/sla/sla-alert-channel-update.contract';
import { SlaAlertUpdatePayloadApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-alert-channel-response-api.dto';

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
            updatedAt: dto.updated_at,
        };
    }

    mapOption(dto: { id: string; name: string }): SlaAlertChannelOptionEntity {
        return { id: dto.id, name: dto.name };
    }

    mapUpdate(
        contract: SlaAlertChannelUpdateContract
    ): SlaAlertUpdatePayloadApiDto {
        return {
            contacts: contract.contacts.map((contact) => ({
                escalation_contact_id: contact.escalationContactId,
                channels: contact.channels.map((channel) => ({
                    channel_id: channel.channelId,
                    enabled: channel.enabled,
                })),
            })),
        };
    }
}
