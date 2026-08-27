import { inject, Injectable } from '@angular/core';
import { ReportNewspaperFilterEntity } from '@shared/components/report-newspaper/domain/entities/report-newspaper-filter.entity';
import { ReportNewspaperEntity } from '@shared/components/report-newspaper/domain/entities/report-newspaper.entity';
import { ReportNewspaperRepository } from '@shared/components/report-newspaper/domain/repositories/report-newspaper-repository';
import { reportNewspaperFilterMapper } from '@shared/components/report-newspaper/infrastructure/data/mappers/report-newspaper-filter.mapper';
import { ReportNewspaperMapper } from '@shared/components/report-newspaper/infrastructure/data/mappers/report-newspaper.mapper';
import { ReportNewspaperApi } from '@shared/components/report-newspaper/infrastructure/data/sources/report-newspaper.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportNewspaperRepositoryImpl implements ReportNewspaperRepository {
    private readonly api = inject(ReportNewspaperApi);
    private readonly mapper = inject(ReportNewspaperMapper);

    execute(
        entity: ReportNewspaperFilterEntity,
        options?: FetchOptions
    ): Observable<ReportNewspaperEntity[]> {
        const paramsDto = reportNewspaperFilterMapper(entity);
        return this.api
            .execute(paramsDto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
