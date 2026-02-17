import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardQuery } from '@presentation/pages/dashboard/application/queries/dashboard.query';
import { DashboardUseCase } from '@presentation/pages/dashboard/application/use-cases/dashboard.use-case';
import { DashboardEntity } from '@presentation/pages/dashboard/domain/entities/dashboard.entity';

@Injectable({ providedIn: 'root' })
export class DashboardHandler {
    constructor(private readonly useCase: DashboardUseCase) {}

    execute(command: DashboardQuery): Observable<DashboardEntity> {
        return this.useCase.execute({
            period: command.period,
        });
    }
}
