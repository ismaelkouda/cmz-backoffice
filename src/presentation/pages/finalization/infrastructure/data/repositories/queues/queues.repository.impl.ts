import { inject, Injectable } from '@angular/core';
import { QueuesFilterEntity } from '@pages/finalization/domain/entities/queues/queues-filter.entity';
import { QueuesEntity } from '@pages/finalization/domain/entities/queues/queues.entity';
import { QueuesRepository } from '@pages/finalization/domain/repositories/queues/queues.repository';
import { QueuesFilterMapper } from '@pages/finalization/infrastructure/data/mappers/queues/queues-filter.mapper';
import { QueuesMapper } from '@pages/finalization/infrastructure/data/mappers/queues/queues.mapper';
import { QueuesApi } from '@pages/finalization/infrastructure/data/sources/queues/queues.api';
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
        page: string
    ): Observable<Paginate<QueuesEntity>> {
        return this.api
            .execute(this.filterMapper.map(entity), page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
