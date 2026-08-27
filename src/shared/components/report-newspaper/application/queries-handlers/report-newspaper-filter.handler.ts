import { reportNewspaperFilterQueryMapper } from '@shared/components/report-newspaper/application/queries-mappers/report-newspaper-filter.mapper';
import { Injectable, inject } from '@angular/core';
import { ReportNewspaperFilterQuery } from '@shared/components/report-newspaper/application/queries/report-newspaper-filter.query';
import { ReportNewspaperUseCase } from '@shared/components/report-newspaper/application/use-cases/report-newspaper.use-case';
import { ReportNewspaperEntity } from '@shared/components/report-newspaper/domain/entities/report-newspaper.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportNewspaperFilterHandler {
    private readonly useCase = inject(ReportNewspaperUseCase);

    execute(
        command: ReportNewspaperFilterQuery,
        options?: FetchOptions
    ): Observable<ReportNewspaperEntity[]> {
        return this.useCase.execute(
            reportNewspaperFilterQueryMapper(command),
            options
        );
    }
}
