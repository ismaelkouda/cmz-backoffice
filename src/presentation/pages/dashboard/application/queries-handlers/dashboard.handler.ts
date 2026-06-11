import { Injectable, inject } from '@angular/core';
import { DashboardQuery } from '@pages/dashboard/application/queries/dashboard.query';
import { DashboardUseCase } from '@pages/dashboard/application/use-cases/dashboard.use-case';
import { DashboardEntity } from '@pages/dashboard/domain/entities/dashboard.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardHandler {
    private readonly useCase = inject(DashboardUseCase);

    execute(
        command: DashboardQuery,
        options?: FetchOptions
    ): Observable<DashboardEntity> {
        return this.useCase.execute(
            {
                period: command.period,
            },
            options
        );
    }
}
