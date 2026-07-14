import { Injectable, inject } from '@angular/core';
import { InfrastructureQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure/infrastructure.query';
import { InfrastructureUseCase } from '@presentation/pages/administrative-infrastructure/application/use-cases/infrastructure/infrastructure.use-case';
import { InfrastructureEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { infrastructureQueryMapper } from '@presentation/pages/administrative-infrastructure/application/queries-mappers/infrastructure/infrastructure.mapper';

@Injectable({ providedIn: 'root' })
export class InfrastructureHandler {
    private readonly useCase = inject(InfrastructureUseCase);

    execute(
        query: InfrastructureQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureEntity>> {
        return this.useCase.execute(
            infrastructureQueryMapper(query),
            page,
            options
        );
    }
}
