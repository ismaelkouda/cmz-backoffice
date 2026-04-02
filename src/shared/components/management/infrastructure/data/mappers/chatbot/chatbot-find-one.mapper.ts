import { Injectable } from '@angular/core';
import {
    ChatbotFindOneEntity,
    ChatbotFindOneProps,
} from '@shared/components/management/domain/entities/chatbot/chatbot-find-one.entity';
import { ChatbotFindOneItemApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class ChatbotFindOneMapper extends SimpleResponseMapper<
    ChatbotFindOneEntity,
    ChatbotFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, ChatbotFindOneEntity>();

    protected mapItemFromDto(
        dto: ChatbotFindOneItemApiDto
    ): ChatbotFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });

        const props: ChatbotFindOneProps = {
            uniqId: dto.uniq_id,
            reportId: dto.report_uniq_id,
            type: dto.type.toLowerCase(),
            targetType: dto.target_type,
            region: dto.region?.id,
            department: dto.department?.id,
            municipality: dto.municipality?.id,
            channels: dto.channels,
            subject: dto.subject,
            content: dto.content,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new ChatbotFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
