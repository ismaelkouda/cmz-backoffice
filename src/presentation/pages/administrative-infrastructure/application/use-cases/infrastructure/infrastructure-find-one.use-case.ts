import { inject } from '@angular/core';
import { InfrastructureFindOneFilterDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-find-one-filter.dto';
import { InfrastructureFindOneFilterEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-find-one-filter.entity';
import { InfrastructureFindOneEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-find-one.entity';
import { InfrastructureFindOneRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure-find-one-repository';
import { InfrastructureFindOneFilterVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure/infrastructure-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export class InfrastructureFindOneUseCase {
    private readonly repository = inject(InfrastructureFindOneRepository);

    execute(
        filterDto: InfrastructureFindOneFilterDto,
        options?: FetchOptions
    ): Observable<InfrastructureFindOneEntity> {
        const vo = InfrastructureFindOneFilterVo.fromDto(filterDto);
        const filter = InfrastructureFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter, options);
    }
}
