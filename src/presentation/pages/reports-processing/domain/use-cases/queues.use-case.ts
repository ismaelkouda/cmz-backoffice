import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { QueuesFilterDto } from '../../application/dto/queues-filter.dto';
import { QueuesFilterEntity } from '../entities/queues/queues-filter.entity';
import { QueuesEntity } from '../entities/queues/queues.entity';
import { QueuesRepository } from '../repositories/queues.repository';
import { QueuesFilterVo } from '../value-objects/queues-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchQueuesUseCase {
    private readonly queuesRepository = inject(QueuesRepository);

    execute(
        filterDto: QueuesFilterDto | null,
        page: string
    ): Observable<Paginate<QueuesEntity>> {
        const vo = QueuesFilterVo.fromDto(filterDto);
        const entity = QueuesFilterEntity.fromVo(vo);
        return this.queuesRepository.fetchQueues(entity, page);
    }
}
