import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { QueuesFilterEntity } from '../../domain/entities/queues/queues-filter.entity';
import { QueuesEntity } from '../../domain/entities/queues/queues.entity';
import { QueuesRepository } from '../../domain/repositories/queues.repository';
import { QueuesFilterMapper } from '../mappers/queues-filter.mapper';
import { QueuesMapper } from '../mappers/queues.mapper';
import { QueuesApi } from '../sources/queues.api';

@Injectable({ providedIn: 'root' })
export class QueuesRepositoryImpl extends QueuesRepository {
    private readonly api = inject(QueuesApi);
    private readonly mapper = inject(QueuesMapper);

    fetchQueues(
        filter: QueuesFilterEntity,
        page: string
    ): Observable<Paginate<QueuesEntity>> {
        const paramsDto = QueuesFilterMapper(filter);
        return this.api
            .execute(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
