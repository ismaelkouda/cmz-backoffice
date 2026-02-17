import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardQuery } from '@presentation/pages/dashboard/application/queries/dashboard.query';
import { DashboardHandler } from '@presentation/pages/dashboard/application/queries-handlers/dashboard.handler';
import { DashboardEntity } from '@presentation/pages/dashboard/domain/entities/dashboard.entity';

@Injectable({ providedIn: 'root' })
export class DashboardBus {
    constructor(private readonly filterHandler: DashboardHandler) {}

    dispatch<T>(query: T): Observable<DashboardEntity> {
        if (query instanceof DashboardQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
