import { ReportNewspaperFilterEntity } from '@shared/components/report-newspaper/domain/entities/report-newspaper-filter.entity';
import { ReportNewspaperEntity } from '@shared/components/report-newspaper/domain/entities/report-newspaper.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ReportNewspaperRepository {
    abstract execute(
        filter: ReportNewspaperFilterEntity,
        options?: FetchOptions
    ): Observable<ReportNewspaperEntity[]>;
}
