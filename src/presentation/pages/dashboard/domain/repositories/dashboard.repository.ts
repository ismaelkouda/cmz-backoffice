import { DashboardFilterEntity } from '@pages/dashboard/domain/entities/dashboard-filter.entity';
import { DashboardEntity } from '@pages/dashboard/domain/entities/dashboard.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class DashboardRepository {
    abstract execute(
        filter: DashboardFilterEntity,
        options?: FetchOptions
    ): Observable<DashboardEntity>;
}
