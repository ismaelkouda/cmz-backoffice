import { inject, Injectable } from '@angular/core';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';
import { mapToHistoryEventType } from '@shared/components/history/domain/enums/history-event-type.enum';
import { HistoryFindOneProps } from '@shared/components/history/domain/interfaces/history-find-one-props.interface';
import { HistoryFindOneItemApiDto } from '@shared/components/history/infrastructure/api/dto/history-find-one-response-api.dto';
import { ActorMapper } from '@shared/data/mappers/actor.mapper';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { HistoryDataParserService } from '@shared/domain/services/history-data-parser';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class HistoryFindOneMapper extends SimpleResponseMapper<
    HistoryFindOneEntity,
    HistoryFindOneItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, HistoryFindOneEntity>();
    private readonly actorMapper = inject(ActorMapper);
    private readonly dataParser = inject(HistoryDataParserService);

    protected mapItemFromDto(
        dto: HistoryFindOneItemApiDto
    ): HistoryFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const changes = this.dataParser.parseByEvent(dto.event, dto.data);

        const user = this.utils.memoized(dto.initiator, (i) =>
            this.actorMapper.mapToEntity(i)
        );

        const props: HistoryFindOneProps = {
            uniqId: dto.id,
            createdAt: dto.created_at,
            event: mapToHistoryEventType(dto.event),
            rawEvent: dto.type_action,
            action: dto.action,
            module: dto.module,
            sourceIp: dto.ip_address,
            user: user,
            accessMethod: dto.agent_use,
            rawData: dto.data,
            changes,
            timestamps: {
                createdAt: dto.created_at,
                updatedAt: dto.updated_at,
            },
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new HistoryFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
