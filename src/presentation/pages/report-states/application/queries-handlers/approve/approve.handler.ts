import { approveQueryMapper } from '@pages/report-states/application/queries-mappers/approve/approve.mapper';
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
        return this.useCase.execute(approveQueryMapper(query), page, options);
    }
}
