import { Injectable, inject } from '@angular/core';
import { InfrastructureTypeFindOneQuery } from '@pages/administrative-infrastructure/application/queries/infrastructure-type/infrastructure-type-find-one.query';
import { InfrastructureTypeFindOneUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure-type/infrastructure-type-find-one.use-case';
import { InfrastructureTypeFindOneEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeFindOneFilterHandler {
    private readonly useCase = inject(InfrastructureTypeFindOneUseCase);

    execute(
        command: InfrastructureTypeFindOneQuery
    ): Observable<InfrastructureTypeFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
