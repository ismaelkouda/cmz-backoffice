import { closeQueryMapper } from '@pages/report-states/application/queries-mappers/close/close.mapper';
import { Injectable, inject } from '@angular/core';
import { CloseQuery } from '@pages/report-states/application/queries/close/close.query';
import { CloseUseCase } from '@pages/report-states/application/use-cases/close/close.use-case';
import { CloseEntity } from '@pages/report-states/domain/entities/close/close.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CloseHandler {
    private readonly useCase = inject(CloseUseCase);

    execute(
        query: CloseQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<CloseEntity>> {
        return this.useCase.execute(closeQueryMapper(query), page, options);
    }
}
