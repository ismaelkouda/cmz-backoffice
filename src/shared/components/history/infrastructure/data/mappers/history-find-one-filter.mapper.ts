import { HistoryFindOneFilterEntity } from '@shared/components/history/domain/entities/history-find-one-filter.entity';
import { HistoryFindOneFilterApiDto } from '@shared/components/history/infrastructure/api/dto/history-find-one-filter-api.dto';

export function historyFindOneFilterMapper(
    entity: HistoryFindOneFilterEntity
): HistoryFindOneFilterApiDto {
    const params: HistoryFindOneFilterApiDto = {} as HistoryFindOneFilterApiDto;

    console.log('entity: ', entity);
    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    if (entity.typeModel) {
        params.type_model = entity.typeModel;
    }

    return params;
}
