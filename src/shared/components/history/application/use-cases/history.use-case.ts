import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HistoryFilterDto } from '@shared/components/history/application/dto/history-filter.dto';
import { HistoryFilterEntity } from '@shared/components/history/domain/entities/history-filter.entity';
import { HistoryEntity } from '@shared/components/history/domain/entities/history.entity';
import { HistoryRepository } from '@shared/components/history/domain/repositories/history.repository';
import { HistoryFilterVo } from '@shared/components/history/domain/value-objects/history-filter.vo';
import { Paginate } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class HistoryUseCase {
    private readonly repository = inject(HistoryRepository);

    execute(
        filterDto: HistoryFilterDto | null,
        page: string
    ): Observable<Paginate<HistoryEntity>> {
        const vo = HistoryFilterVo.fromDto(filterDto);
        const entity = HistoryFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
    }
}
