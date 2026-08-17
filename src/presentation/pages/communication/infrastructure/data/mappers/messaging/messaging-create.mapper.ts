import { inject, Injectable } from '@angular/core';
import { MessagingCreateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-create.entity';
import { MessagingCreateApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-create-api.dto';
import { MessagingTypeMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-type.mapper';
import { MessagingTargetMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-target.mapper';
import { MessagingChannelsMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-channels.mapper';

@Injectable({ providedIn: 'root' })
export class MessagingCreateMapper {
    private readonly typeMapper = inject(MessagingTypeMapper);
    private readonly targetMapper = inject(MessagingTargetMapper);
    private readonly channelsMapper = inject(MessagingChannelsMapper);
    mapFromEntity(entity: MessagingCreateEntity): MessagingCreateApiDto {
        const params: MessagingCreateApiDto = {} as MessagingCreateApiDto;

        if (entity.data.type) {
            params.type = this.typeMapper.mapToDto(entity.data.type);
        }
        if (entity.data.reportId) {
            params.report_uniq_id = entity.data.reportId;
        }
        if (entity.data.targetType) {
            params.target_type = this.targetMapper.mapToDto(
                entity.data.targetType
            );
        }
        if (entity.data.region) {
            params.region_id = entity.data.region;
        }
        if (entity.data.department) {
            params.department_id = entity.data.department;
        }
        if (entity.data.municipality) {
            params.municipality_id = entity.data.municipality;
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
