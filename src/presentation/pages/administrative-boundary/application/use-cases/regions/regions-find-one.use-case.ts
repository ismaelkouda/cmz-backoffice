import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RegionsFindOneFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-find-one-filter.entity';
import { RegionsFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';
import { RegionsFindOneRepository } from '@presentation/pages/administrative-boundary/domain/repositories/regions/regions-find-one-repository';
import { RegionsFindOneFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/regions/regions-find-one-filter.vo';

import { RegionsFindOneFilterDto } from '../../dto/regions/regions-find-one-filter.dto';

@Injectable({
    providedIn: 'root',
})
export class RegionsFindOneUseCase {
    private readonly repository = inject(RegionsFindOneRepository);

    execute(
        filterDto: RegionsFindOneFilterDto
    ): Observable<RegionsFindOneEntity> {
        const vo = RegionsFindOneFilterVo.fromDto(filterDto);
        const filter = RegionsFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter);
    }
}
