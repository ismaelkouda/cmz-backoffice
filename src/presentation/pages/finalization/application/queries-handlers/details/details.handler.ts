import { detailsQueryMapper } from '@pages/finalization/application/queries-mappers/details/details.mapper';
import { Injectable, inject } from '@angular/core';
import { DetailsQuery } from '@pages/finalization/application/queries/details/details.query';
import { DetailsUseCase } from '@pages/finalization/application/use-cases/details/details.use-case';
import { DetailsEntity } from '@pages/finalization/domain/entities/details/details.entity';
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
