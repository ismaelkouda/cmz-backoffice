import { Injectable, inject } from '@angular/core';
import { infrastructureFindOneQueryMapper } from '@presentation/pages/administrative-infrastructure/application/queries-mappers/infrastructure/infrastructure-find-one.mapper';
import { InfrastructureFindOneQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure/infrastructure-find-one.query';
import { InfrastructureFindOneUseCase } from '@presentation/pages/administrative-infrastructure/application/use-cases/infrastructure/infrastructure-find-one.use-case';
import { InfrastructureFindOneEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureFindOneHandler {
    private readonly useCase = inject(InfrastructureFindOneUseCase);

    execute(
        command: InfrastructureFindOneQuery,
        options?: FetchOptions
    ): Observable<InfrastructureFindOneEntity> {
        return this.useCase.execute(
            infrastructureFindOneQueryMapper(command),
            options
        );
    }
}
