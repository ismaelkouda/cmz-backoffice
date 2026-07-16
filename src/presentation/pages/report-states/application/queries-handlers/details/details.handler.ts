import { detailsQueryMapper } from '@pages/report-states/application/queries-mappers/details/details.mapper';
import { Injectable, inject } from '@angular/core';
import { DetailsQuery } from '@pages/report-states/application/queries/details/details.query';
import { DetailsUseCase } from '@pages/report-states/application/use-cases/details/details.use-case';
import { DetailsEntity } from '@pages/report-states/domain/entities/details/details.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsHandler {
    private readonly useCase = inject(DetailsUseCase);

    execute(
        command: DetailsQuery,
        options?: FetchOptions
    ): Observable<DetailsEntity> {
        return this.useCase.execute(detailsQueryMapper(command), options);
    }
}
