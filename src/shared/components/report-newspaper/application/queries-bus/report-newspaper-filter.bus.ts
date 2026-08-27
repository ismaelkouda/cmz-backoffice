import { Injectable, inject } from '@angular/core';
import { ReportNewspaperFilterQuery } from '@shared/components/report-newspaper/application/queries/report-newspaper-filter.query';
import { ReportNewspaperFilterHandler } from '@shared/components/report-newspaper/application/queries-handlers/report-newspaper-filter.handler';
import { ReportNewspaperEntity } from '@shared/components/report-newspaper/domain/entities/report-newspaper.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class ReportNewspaperFilterBus {
    private readonly filterHandler = inject(ReportNewspaperFilterHandler);

    dispatch<T>(
        query: T,
        options?: FetchOptions
    ): Observable<ReportNewspaperEntity[]> {
        if (query instanceof ReportNewspaperFilterQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
