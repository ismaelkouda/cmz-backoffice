import { inject, Injectable } from '@angular/core';
import { InfrastructureFindOneFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-find-one-filter.contract';
import { InfrastructureFindOneEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-find-one.entity';
import { InfrastructureFindOneRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure-find-one.repository';
import { infrastructureFindOneFilterVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureFindOneUseCase {
    private readonly repository = inject(InfrastructureFindOneRepository);

    execute(
        contract: InfrastructureFindOneFilterContract,
        options?: FetchOptions
    ): Observable<InfrastructureFindOneEntity> {
        return defer(() =>
            this.repository.execute(
                infrastructureFindOneFilterVo(contract),
                options
            )
        );
    }
}
