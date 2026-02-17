import { Observable } from 'rxjs';

import { DashboardFilterEntity } from '@presentation/pages/dashboard/domain/entities/dashboard-filter.entity';
import { DashboardEntity } from '@presentation/pages/dashboard/domain/entities/dashboard.entity';

export abstract class DashboardRepository {
    abstract execute(
        filter: DashboardFilterEntity
    ): Observable<DashboardEntity>;
}
