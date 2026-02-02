import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HistoryFilterDto } from '@shared/components/history/core/application/dtos/history-filter.dto';
import { HistoryFilterEntity } from '@shared/components/history/core/domain/entities/history-filter.entity';
import { HistoryEntity } from '@shared/components/history/core/domain/entities/history.entity';
import { HistoryRepository } from '@shared/components/history/core/domain/repositories/history.repository';
import { HistoryFilterVo } from '@shared/components/history/core/domain/value-objects/history-filter.vo';
import { Paginate } from '@shared/data/dtos/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class HistoryUseCase {
    private readonly repository = inject(HistoryRepository);

    readAll(
        filterDto: HistoryFilterDto | null,
        page: string
    ): Observable<Paginate<HistoryEntity>> {
        const vo = HistoryFilterVo.fromDto(filterDto);
        const entity = HistoryFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
    }
}
