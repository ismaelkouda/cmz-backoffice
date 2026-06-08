import { inject, Injectable } from '@angular/core';
import { QueuesFilterEntity } from '@pages/processing/domain/entities/queues/queues-filter.entity';
import { QueuesEntity } from '@pages/processing/domain/entities/queues/queues.entity';
import { QueuesRepository } from '@pages/processing/domain/repositories/queues/queues.repository';
import { QueuesFilterMapper } from '@pages/processing/infrastructure/data/mappers/queues/queues-filter.mapper';
import { QueuesMapper } from '@pages/processing/infrastructure/data/mappers/queues/queues.mapper';
import { QueuesApi } from '@pages/processing/infrastructure/data/sources/queues/queues.api';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class QueuesRepositoryImpl extends QueuesRepository {
    private readonly api = inject(QueuesApi);
    private readonly mapper = inject(QueuesMapper);
    private readonly filterMapper = inject(QueuesFilterMapper);

    execute(
        entity: QueuesFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<QueuesEntity>> {
        return this.api
            .execute(this.filterMapper.map(entity), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
