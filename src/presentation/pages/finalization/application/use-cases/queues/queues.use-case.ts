import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { QueuesFilterDto } from '@presentation/pages/finalization/application/dto/queues/queues-filter.dto';
import { QueuesFilterEntity } from '@presentation/pages/finalization/domain/entities/queues/queues-filter.entity';
import { QueuesEntity } from '@presentation/pages/finalization/domain/entities/queues/queues.entity';
import { QueuesRepository } from '@presentation/pages/finalization/domain/repositories/queues/queues.repository';
import { QueuesFilterVo } from '@presentation/pages/finalization/domain/value-objects/queues/queues-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class QueuesUseCase {
    private readonly repository = inject(QueuesRepository);

    execute(
        filterDto: QueuesFilterDto | null,
        page: string
    ): Observable<Paginate<QueuesEntity>> {
        const vo = QueuesFilterVo.fromDto(filterDto);
        const entity = QueuesFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page);
    }
}
