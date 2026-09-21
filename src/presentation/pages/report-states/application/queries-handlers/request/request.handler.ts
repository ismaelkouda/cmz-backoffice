import { requestQueryMapper } from '@pages/report-states/application/queries-mappers/request/request.mapper';
import { Injectable, inject } from '@angular/core';
import { RequestQuery } from '@pages/report-states/application/queries/request/request.query';
import { RequestUseCase } from '@pages/report-states/application/use-cases/request/request.use-case';
import { RequestEntity } from '@pages/report-states/domain/entities/request/request.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestHandler {
    private readonly useCase = inject(RequestUseCase);

    execute(
        query: RequestQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RequestEntity>> {
        return this.useCase.execute(requestQueryMapper(query), page, options);
    }
}
