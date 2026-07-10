import { inject } from '@angular/core';
import { InfrastructureTypeFindOneFilterDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-find-one-filter.dto';
import { InfrastructureTypeFindOneFilterEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-find-one-filter.entity';
import { InfrastructureTypeFindOneEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-find-one.entity';
import { InfrastructureTypeFindOneRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure-type/infrastructure-type-find-one-repository';
import { InfrastructureTypeFindOneFilterVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export class InfrastructureTypeFindOneUseCase {
    private readonly repository = inject(InfrastructureTypeFindOneRepository);

    execute(
        filterDto: InfrastructureTypeFindOneFilterDto,
        options?: FetchOptions
    ): Observable<InfrastructureTypeFindOneEntity> {
        const vo = InfrastructureTypeFindOneFilterVo.fromDto(filterDto);
        const filter = InfrastructureTypeFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter, options);
    }
}
