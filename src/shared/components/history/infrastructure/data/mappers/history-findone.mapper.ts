import { HistoryFindOneEntity } from '@shared/components/history/core/domain/entities/history-find-one.entity';
import { HistoryFindOneItemApiDto } from '@shared/components/history/infrastructure/api/dtos/history-findone-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

export class HistoryFindonMapper extends SimpleResponseMapper<
    HistoryFindOneEntity,
    HistoryFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, HistoryFindOneEntity>();

    protected mapItemFromDto(
        dto: HistoryFindOneItemApiDto
    ): HistoryFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : HistoryFindOneEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
