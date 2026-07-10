import { Injectable, inject } from '@angular/core';
import { InfrastructureFindOneQuery } from '@pages/administrative-infrastructure/application/queries/infrastructure/infrastructure-find-one.query';
import { InfrastructureFindOneUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure/infrastructure-find-one.use-case';
import { InfrastructureFindOneEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureFindOneFilterHandler {
    private readonly useCase = inject(InfrastructureFindOneUseCase);

    execute(
        command: InfrastructureFindOneQuery
    ): Observable<InfrastructureFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
