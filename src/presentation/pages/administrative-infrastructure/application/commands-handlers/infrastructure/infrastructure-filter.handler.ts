import { Injectable, inject } from '@angular/core';
import { InfrastructureQuery } from '@pages/administrative-infrastructure/application/queries/infrastructure/infrastructure.query';
import { InfrastructureUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure/infrastructure.use-case';
import { InfrastructureEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureFilterHandler {
    private readonly useCase = inject(InfrastructureUseCase);

    execute(
        command: InfrastructureQuery,
        page: string
    ): Observable<Paginate<InfrastructureEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
            },
            page
        );
    }
}
