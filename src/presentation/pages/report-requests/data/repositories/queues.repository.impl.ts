import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { QueuesMapper } from '@presentation/pages/report-requests/data/mappers/queues.mapper';
import { QueuesApi } from '@presentation/pages/report-requests/data/sources/queues.api';
import { QueuesEntity } from '@presentation/pages/report-requests/domain/entities/queues/queues.entity';
import { QueuesRepository } from '@presentation/pages/report-requests/domain/repositories/queues.repository';
import { QueuesFilter } from '@presentation/pages/report-requests/domain/value-objects/queues-filter.vo';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QueuesRepositoryImpl extends QueuesRepository {
    constructor(
        private readonly api: QueuesApi,
        private readonly queuesMapper: QueuesMapper,
        private readonly translateService: TranslateService
    ) {
        super();
    }

    fetchQueues(
        filter: QueuesFilter,
        page: string
    ): Observable<Paginate<QueuesEntity>> {
        return this.api.fetchQueues(filter.toDto(), page).pipe(
            map((response) => this.queuesMapper.mapFromDto(response)),
            catchError((error: unknown) =>
                throwError(
                    () =>
                        new Error(
                            error instanceof Error
                                ? error.message
                                : this.translateService.instant(
                                      'OVERSEEING_OPERATIONS.MESSAGES.ERROR.UNABLE_TO_FETCH_QUEUES'
                                  )
                        )
                )
            )
        );
    }
}
