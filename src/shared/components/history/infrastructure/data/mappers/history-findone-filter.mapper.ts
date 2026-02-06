import { HistoryFindOneFilterEntity } from '@shared/components/history/core/domain/entities/history-findone-filter.entity';
import { HistoryFindOneFilterApiDto } from '@shared/components/history/infrastructure/api/dtos/history-findone-filter-api.dto';

export function historyFindOneFilterMapper(
    entity: HistoryFindOneFilterEntity
): HistoryFindOneFilterApiDto {
    const params: HistoryFindOneFilterApiDto = {} as HistoryFindOneFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}
