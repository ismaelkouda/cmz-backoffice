import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WaitingMapper } from '@presentation/pages/report-requests/data/mappers/waiting.mapper';
import { WaitingApi } from '@presentation/pages/report-requests/data/sources/waiting.api';
import { WaitingEntity } from '@presentation/pages/report-requests/domain/entities/waiting/waiting.entity';
import { WaitingRepository } from '@presentation/pages/report-requests/domain/repositories/waiting.repository';
import { WaitingFilter } from '@presentation/pages/report-requests/domain/value-objects/waiting-filter.vo';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WaitingRepositoryImpl extends WaitingRepository {
    constructor(
        private readonly api: WaitingApi,
        private readonly waitingMapper: WaitingMapper,
        private readonly translateService: TranslateService
    ) {
        super();
    }

    fetchWaiting(
        filter: WaitingFilter,
        page: string
    ): Observable<Paginate<WaitingEntity>> {
        return this.api.fetchWaiting(filter.toDto(), page).pipe(
            map((response) => this.waitingMapper.mapFromDto(response)),
            catchError((error: unknown) =>
                throwError(
                    () =>
                        new Error(
                            error instanceof Error
                                ? error.message
                                : this.translateService.instant(
                                      'OVERSEEING_OPERATIONS.MESSAGES.ERROR.UNABLE_TO_FETCH_WAITING'
                                  )
                        )
                )
            )
        );
    }
}
