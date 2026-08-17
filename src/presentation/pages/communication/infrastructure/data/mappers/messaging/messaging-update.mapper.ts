import { MessagingUpdateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-update.entity';
import { MessagingUpdateApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-update-api.dto';
import { MessagingTypeMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-type.mapper';
import { MessagingTargetMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-target.mapper';
import { MessagingChannelsMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-channels.mapper';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessagingUpdateMapper {
    private readonly typeMapper = inject(MessagingTypeMapper);
    private readonly targetMapper = inject(MessagingTargetMapper);
    private readonly channelsMapper = inject(MessagingChannelsMapper);

    mapFromEntity(entity: MessagingUpdateEntity): MessagingUpdateApiDto {
        const params: MessagingUpdateApiDto = {} as MessagingUpdateApiDto;

        if (entity.data.reportId) {
            params.report_uniq_id = entity.data.reportId;
        }
        if (entity.data.uniqId) {
            params.id = entity.data.uniqId;
        }
        if (entity.data.type) {
            params.type = this.typeMapper.mapToDto(entity.data.type);
        }
        if (entity.data.targetType) {
            params.target_type = this.targetMapper.mapToDto(
                entity.data.targetType
            );
        }
        if (entity.data.region) {
            params.region = entity.data.region;
        }
        if (entity.data.department) {
            params.department = entity.data.department;
        }
        if (entity.data.municipality) {
            params.municipality = entity.data.municipality;
        }
        if (entity.data.channels) {
            params.channels = entity.data.channels.map((channel) =>
                this.channelsMapper.mapToDto(channel)
            );
        }
        if (entity.data.subject) {
            params.subject = entity.data.subject;
        }
        if (entity.data.content) {
            params.content = entity.data.content;
        }

        return params;
    }
}
