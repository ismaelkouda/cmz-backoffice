import { DashboardFilterEntity } from '@pages/dashboard/domain/entities/dashboard-filter.entity';
import { DashboardEntity } from '@pages/dashboard/domain/entities/dashboard.entity';
import { Observable } from 'rxjs';

export abstract class DashboardRepository {
    abstract execute(
        filter: DashboardFilterEntity
    ): Observable<DashboardEntity>;
}
