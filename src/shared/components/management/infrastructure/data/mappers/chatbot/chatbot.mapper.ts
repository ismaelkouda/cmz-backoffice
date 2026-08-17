import { inject, Injectable } from '@angular/core';
import { ChatbotEntity } from '@shared/components/management/domain/entities/chatbot/chatbot.entity';
import { ChatbotProps } from '@shared/components/management/domain/interfaces/chatbot/chatbot-props.interface';
import { ChatbotItemApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-response-api.dto';
import { ChannelsMapper } from '@shared/components/management/infrastructure/data/mappers/chatbot/chatbot-channels.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class ChatbotMapper extends PaginatedMapper<
    ChatbotEntity,
    ChatbotItemApiDto
> {
    private readonly entityCache = new Map<string, ChatbotEntity>();
    private readonly channelsMapper = inject(ChannelsMapper);
    private readonly utils = new MapperUtils();

    protected mapItemFromDto(dto: ChatbotItemApiDto): ChatbotEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });
        const props: ChatbotProps = {
            uniqId: dto.uniq_id,
            reportId: dto.report_id,
            type: dto.type,
            targetType: dto.target_type,
            region: dto.region,
            department: dto.department,
            municipality: dto.municipality,
            channels: this.utils.memoizedList(
                dto?.channels,
                (p) => this.channelsMapper.mapFromDto(p),
                (p) => `channel${p}`
            ),
            subject: dto.subject,
            content: dto.content,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new ChatbotEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
