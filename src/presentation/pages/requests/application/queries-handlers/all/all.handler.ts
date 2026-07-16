import { allQueryMapper } from '@pages/requests/application/queries-mappers/all/all.mapper';
import { Injectable, inject } from '@angular/core';
import { AllQuery } from '@pages/requests/application/queries/all/all.query';
import { AllUseCase } from '@pages/requests/application/use-cases/all/all.use-case';
import { AllEntity } from '@pages/requests/domain/entities/all/all.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllHandler {
    private readonly useCase = inject(AllUseCase);

    execute(
        query: AllQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AllEntity>> {
        return this.useCase.execute(allQueryMapper(query), page, options);
    }
}
