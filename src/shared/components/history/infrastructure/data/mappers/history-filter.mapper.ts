import { inject, Injectable } from '@angular/core';
import { HistoryFilterEntity } from '@shared/components/history/domain/entities/history-filter.entity';
import { HistoryFilterApiDto } from '@shared/components/history/infrastructure/api/dto/history-filter-api.dto';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';

@Injectable({
    providedIn: 'root',
})
export class HistoryFilterMapper {
    private readonly apiDateMapper = inject(ApiDateMapper);
    map(vo: HistoryFilterEntity): HistoryFilterApiDto {
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
            params.start_date = this.apiDateMapper.toDateApi(vo.period.start);
        }
        if (vo.period?.end) {
            params.end_date = this.apiDateMapper.toDateApi(vo.period.end);
        }

        return { ...params };
    }
}
