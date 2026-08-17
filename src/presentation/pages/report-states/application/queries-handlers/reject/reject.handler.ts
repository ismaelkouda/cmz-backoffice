import { rejectQueryMapper } from '@pages/report-states/application/queries-mappers/reject/reject.mapper';
import { Injectable, inject } from '@angular/core';
import { RejectQuery } from '@pages/report-states/application/queries/reject/reject.query';
import { RejectUseCase } from '@pages/report-states/application/use-cases/reject/reject.use-case';
import { RejectEntity } from '@pages/report-states/domain/entities/reject/reject.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RejectHandler {
    private readonly useCase = inject(RejectUseCase);

    execute(
        query: RejectQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RejectEntity>> {
        return this.useCase.execute(rejectQueryMapper(query), page, options);
    }
}
