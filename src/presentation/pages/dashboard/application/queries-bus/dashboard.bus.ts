import { Injectable } from '@angular/core';
import { DashboardQuery } from '@pages/dashboard/application/queries/dashboard.query';
import { DashboardHandler } from '@pages/dashboard/application/queries-handlers/dashboard.handler';
import { DashboardEntity } from '@pages/dashboard/domain/entities/dashboard.entity';
import { Observable } from 'rxjs';

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
