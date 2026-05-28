import { Injectable, inject } from '@angular/core';
import { CloseQuery } from '@pages/report-states/application/queries/close/close.query';
import { CloseUseCase } from '@pages/report-states/application/use-cases/close/close.use-case';
import { CloseEntity } from '@pages/report-states/domain/entities/close/close.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CloseHandler {
    private readonly useCase = inject(CloseUseCase);

    execute(
        query: CloseQuery,
        page: string
    ): Observable<Paginate<CloseEntity>> {
        return this.useCase.execute(
            {
                initiatorPhoneNumber: query.initiatorPhoneNumber,
                uniqId: query.uniqId,
                reportType: query.reportType,
                operators: query.operators,
                source: query.source,
                startDate: query.startDate,
                endDate: query.endDate,
            },
            page
        );
    }
}
