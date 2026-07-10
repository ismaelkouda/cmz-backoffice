import { Injectable, inject } from '@angular/core';
import { InfrastructureQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure/infrastructure.query';
import { InfrastructureUseCase } from '@presentation/pages/administrative-infrastructure/application/use-cases/infrastructure/infrastructure.use-case';
import { InfrastructureEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureHandler {
    private readonly useCase = inject(InfrastructureUseCase);

    execute(
        command: InfrastructureQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                type: command.type,
                region: command.region,
                department: command.department,
                municipality: command.municipality,
                position: command.position,
            },
            page,
            options
        );
    }
}
