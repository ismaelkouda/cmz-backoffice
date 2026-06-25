import { Injectable, inject } from '@angular/core';
import { ApproveQuery } from '@pages/report-states/application/queries/approve/approve.query';
import { ApproveUseCase } from '@pages/report-states/application/use-cases/approve/approve.use-case';
import { ApproveEntity } from '@pages/report-states/domain/entities/approve/approve.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApproveHandler {
    private readonly useCase = inject(ApproveUseCase);

    execute(
        query: ApproveQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ApproveEntity>> {
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
            page,
            options
        );
    }
}
