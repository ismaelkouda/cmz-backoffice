import { inject, Injectable } from '@angular/core';
import { HistoryFindOneFilterDto } from '@shared/components/history/application/dto/history-find-one-filter.dto';
import { HistoryFindOneFilterEntity } from '@shared/components/history/domain/entities/history-find-one-filter.entity';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';
import { HistoryFindOneRepository } from '@shared/components/history/domain/repositories/history-find-one-repository';
import { HistoryFindOneFilterVo } from '@shared/components/history/domain/value-objects/history-find-one-filter.vo';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryFindOneUseCase {
    private readonly repository = inject(HistoryFindOneRepository);

    read(filterDto: HistoryFindOneFilterDto): Observable<HistoryFindOneEntity> {
        const vo = HistoryFindOneFilterVo.fromDto(filterDto);
        const filter = HistoryFindOneFilterEntity.fromVo(vo);
        return this.repository.read(filter);
    }
}
