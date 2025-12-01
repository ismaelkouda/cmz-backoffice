import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AllMapper } from '@presentation/pages/report-requests/data/mappers/all.mapper';
import { AllApi } from '@presentation/pages/report-requests/data/sources/all.api';
import { AllEntity } from '@presentation/pages/report-requests/domain/entities/all/all.entity';
import { AllRepository } from '@presentation/pages/report-requests/domain/repositories/all.repository';
import { AllFilter } from '@presentation/pages/report-requests/domain/value-objects/all-filter.vo';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllRepositoryImpl extends AllRepository {
    constructor(
        private readonly api: AllApi,
        private readonly allMapper: AllMapper,
        private readonly translateService: TranslateService
    ) {
        super();
    }

    fetchAll(filter: AllFilter, page: string): Observable<Paginate<AllEntity>> {
        return this.api.fetchAll(filter.toDto(), page).pipe(
            map((response) => this.allMapper.mapFromDto(response)),
            catchError((error: unknown) =>
                throwError(
                    () =>
                        new Error(
                            error instanceof Error
                                ? error.message
                                : this.translateService.instant(
                                    'OVERSEEING_OPERATIONS.MESSAGES.ERROR.UNABLE_TO_FETCH_ALL'
                                )
                        )
                )
            )
        );
    }
}
