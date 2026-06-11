import { Injectable, inject } from '@angular/core';
import { DashboardQuery } from '@pages/dashboard/application/queries/dashboard.query';
import { DashboardHandler } from '@pages/dashboard/application/queries-handlers/dashboard.handler';
import { DashboardEntity } from '@pages/dashboard/domain/entities/dashboard.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class DashboardBus {
    private readonly filterHandler = inject(DashboardHandler);

    dispatch<T>(query: T, options?: FetchOptions): Observable<DashboardEntity> {
        if (query instanceof DashboardQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
