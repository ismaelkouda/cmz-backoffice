import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { HistoryFindOneFilterDto } from '@shared/components/history/application/dto/history-findone-filter.dto';
import { HistoryFindOneFilterEntity } from '@shared/components/history/domain/entities/history-find-one-filter.entity';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';
import { HistoryFindOneRepository } from '@shared/components/history/domain/repositories/history-findone-repository';
import { HistoryFindOneFilterVo } from '@shared/components/history/domain/value-objects/history-findone-filter.vo';

export class HistoryFindOneUseCase {
    private readonly repository = inject(HistoryFindOneRepository);

    execute(
        filterDto: HistoryFindOneFilterDto
    ): Observable<HistoryFindOneEntity> {
        const vo = HistoryFindOneFilterVo.fromDto(filterDto);
        const filter = HistoryFindOneFilterEntity.fromVo(vo);
        return this.repository.read(filter);
    }
}
