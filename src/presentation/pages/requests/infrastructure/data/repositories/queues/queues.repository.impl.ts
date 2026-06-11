import { inject, Injectable } from '@angular/core';
import { QueuesFilterEntity } from '@pages/requests/domain/entities/queues/queues-filter.entity';
import { QueuesEntity } from '@pages/requests/domain/entities/queues/queues.entity';
import { QueuesRepository } from '@pages/requests/domain/repositories/queues/queues.repository';
import { QueuesFilterMapper } from '@pages/requests/infrastructure/data/mappers/queues/queues-filter.mapper';
import { QueuesMapper } from '@pages/requests/infrastructure/data/mappers/queues/queues.mapper';
import { QueuesApi } from '@pages/requests/infrastructure/data/sources/queues/queues.api';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
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
        const paramsDto = this.filterMapper.map(entity);
        return this.api
            .execute(paramsDto, page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
