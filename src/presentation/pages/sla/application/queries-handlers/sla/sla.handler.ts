import { inject, Injectable } from '@angular/core';
import { SlaQuery } from '@pages/sla/application/queries/sla/sla.query';
import { SlaUseCase } from '@pages/sla/application/use-cases/sla/sla.use-case';
import { SlaEntity } from '@pages/sla/domain/entities/sla/sla.entity';
import { Observable } from 'rxjs';
import { slaQueryMapper } from '@pages/sla/application/queries-mappers/sla/sla.mapper';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class SlaHandler {
    private readonly useCase = inject(SlaUseCase);

    execute(query: SlaQuery, options?: FetchOptions): Observable<SlaEntity[]> {
        return this.useCase.execute(slaQueryMapper(query), options);
    }
}
