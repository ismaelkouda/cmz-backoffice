import { inject } from '@angular/core';
import { InfrastructureTypeFindOneFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-find-one-filter.contract';
import { InfrastructureTypeFindOneEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-find-one.entity';
import { InfrastructureTypeFindOneRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure-type/infrastructure-type-find-one.repository';
import { infrastructureTypeFindOneFilterVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

export class InfrastructureTypeFindOneUseCase {
    private readonly repository = inject(InfrastructureTypeFindOneRepository);

    execute(
        contract: InfrastructureTypeFindOneFilterContract,
        options?: FetchOptions
    ): Observable<InfrastructureTypeFindOneEntity> {
        return defer(() =>
            this.repository.execute(
                infrastructureTypeFindOneFilterVo(contract),
                options
            )
        );
    }
}
