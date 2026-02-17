import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { QueuesFilterEntity } from '@presentation/pages/processing/domain/entities/queues/queues-filter.entity';
import { QueuesEntity } from '@presentation/pages/processing/domain/entities/queues/queues.entity';
import { QueuesRepository } from '@presentation/pages/processing/domain/repositories/queues/queues.repository';
import { queuesFilterMapper } from '@presentation/pages/processing/infrastructure/data/mappers/queues/queues-filter.mapper';
import { QueuesMapper } from '@presentation/pages/processing/infrastructure/data/mappers/queues/queues.mapper';
import { QueuesApi } from '@presentation/pages/processing/infrastructure/data/sources/queues/queues.api';

@Injectable({
    providedIn: 'root',
})
export class QueuesRepositoryImpl extends QueuesRepository {
    private readonly api = inject(QueuesApi);
    private readonly mapper = inject(QueuesMapper);

    execute(
        entity: QueuesFilterEntity,
        page: string
    ): Observable<Paginate<QueuesEntity>> {
        return this.api
            .execute(queuesFilterMapper(entity), page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
