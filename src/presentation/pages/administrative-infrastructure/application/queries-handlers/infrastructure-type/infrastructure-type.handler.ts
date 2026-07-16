import { Injectable, inject } from '@angular/core';
import { infrastructureTypeQueryMapper } from '@presentation/pages/administrative-infrastructure/application/queries-mappers/infrastructure-type/infrastructure-type.mapper';
import { InfrastructureTypeQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure-type/infrastructure-type.query';
import { InfrastructureTypeUseCase } from '@presentation/pages/administrative-infrastructure/application/use-cases/infrastructure-type/infrastructure-type.use-case';
import { InfrastructureTypeEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeHandler {
    private readonly useCase = inject(InfrastructureTypeUseCase);

    execute(
        command: InfrastructureTypeQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureTypeEntity>> {
        return this.useCase.execute(
            infrastructureTypeQueryMapper(command),
            page,
            options
        );
    }
}
