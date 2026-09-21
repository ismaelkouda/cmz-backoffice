import { Injectable, inject } from '@angular/core';
import { AllQuery } from '@pages/report-states/application/queries/all/all.query';
import { AllHandler } from '@pages/report-states/application/queries-handlers/all/all.handler';
import { AllEntity } from '@pages/report-states/domain/entities/all/all.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { StatsDto as AllStatsDto } from '@pages/report-states/infrastructure/api/dto/all/all-response-api.dto';

@Injectable({ providedIn: 'root' })
export class AllBus {
    private readonly filterHandler = inject(AllHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AllEntity, AllStatsDto>> {
        if (query instanceof AllQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
