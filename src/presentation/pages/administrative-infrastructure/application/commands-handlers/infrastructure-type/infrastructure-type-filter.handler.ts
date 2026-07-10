import { Injectable, inject } from '@angular/core';
import { InfrastructureTypeQuery } from '@pages/administrative-infrastructure/application/queries/infrastructure-type/infrastructure-type.query';
import { InfrastructureTypeUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure-type/infrastructure-type.use-case';
import { InfrastructureTypeEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeFilterHandler {
    private readonly useCase = inject(InfrastructureTypeUseCase);

    execute(
        command: InfrastructureTypeQuery,
        page: string
    ): Observable<Paginate<InfrastructureTypeEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
            },
            page
        );
    }
}
