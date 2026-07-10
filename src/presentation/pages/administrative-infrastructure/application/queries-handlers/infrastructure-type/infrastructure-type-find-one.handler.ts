import { Injectable, inject } from '@angular/core';
import { InfrastructureTypeFindOneQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure-type/infrastructure-type-find-one.query';
import { InfrastructureTypeFindOneUseCase } from '@presentation/pages/administrative-infrastructure/application/use-cases/infrastructure-type/infrastructure-type-find-one.use-case';
import { InfrastructureTypeFindOneEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeFindOneHandler {
    private readonly useCase = inject(InfrastructureTypeFindOneUseCase);

    execute(
        command: InfrastructureTypeFindOneQuery,
        options?: FetchOptions
    ): Observable<InfrastructureTypeFindOneEntity> {
        return this.useCase.execute(
            {
                uniqId: command.uniqId,
            },
            options
        );
    }
}
