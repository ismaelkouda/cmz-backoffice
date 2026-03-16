import { Injectable } from '@angular/core';
import { ReportsUseCase } from '@pages/reporting/application/use-cases/reports/reports.use-case';
import { ReportsEntity } from '@pages/reporting/domain/entities/reports/reports.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportsHandler {
    constructor(private readonly useCase: ReportsUseCase) {}

    execute(): Observable<ReportsEntity> {
        return this.useCase.execute();
    }
}
