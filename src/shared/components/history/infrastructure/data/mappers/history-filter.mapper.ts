import { HistoryFilterEntity } from '@shared/components/history/domain/entities/history-filter.entity';
import { HistoryFilterApiDto } from '@shared/components/history/infrastructure/api/dto/history-filter-api.dto';

export function HistoryFilterMapper(
    vo: HistoryFilterEntity
): HistoryFilterApiDto {
    const params: HistoryFilterApiDto = {} as HistoryFilterApiDto;

    if (vo.typeModel) {
        params.type_model = vo.typeModel;
    }

    if (vo.module) {
        params.module = vo.module;
    }

    if (vo.search) {
        params.search = vo.search;
    }
    if (vo.period?.start) {
        params.start_date = vo.period.start;
    }
    if (vo.period?.end) {
        params.end_date = vo.period.end;
    }

    return { ...params };
}
