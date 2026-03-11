import { Injectable } from '@angular/core';
import { DashboardQuery } from '@pages/dashboard/application/queries/dashboard.query';
import { DashboardUseCase } from '@pages/dashboard/application/use-cases/dashboard.use-case';
import { DashboardEntity } from '@pages/dashboard/domain/entities/dashboard.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardHandler {
    constructor(private readonly useCase: DashboardUseCase) {}

    execute(command: DashboardQuery): Observable<DashboardEntity> {
        return this.useCase.execute({
            period: command.period,
        });
    }
}
