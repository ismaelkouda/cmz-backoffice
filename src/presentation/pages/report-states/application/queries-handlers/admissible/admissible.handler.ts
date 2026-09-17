import { admissibleQueryMapper } from '@pages/report-states/application/queries-mappers/admissible/admissible.mapper';
import { Injectable, inject } from '@angular/core';
import { AdmissibleQuery } from '@pages/report-states/application/queries/admissible/admissible.query';
import { AdmissibleUseCase } from '@pages/report-states/application/use-cases/admissible/admissible.use-case';
import { AdmissibleEntity } from '@pages/report-states/domain/entities/admissible/admissible.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdmissibleHandler {
    private readonly useCase = inject(AdmissibleUseCase);

    execute(
        query: AdmissibleQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AdmissibleEntity>> {
        return this.useCase.execute(
            admissibleQueryMapper(query),
            page,
            options
        );
    }
}
