import { Injectable, inject } from '@angular/core';
import { RegionsFindOneFilterEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-find-one-filter.entity';
import { RegionsFindOneEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';
import { RegionsFindOneRepository } from '@pages/administrative-boundary/domain/repositories/regions/regions-find-one-repository';
import { RegionsFindOneFilterVo } from '@pages/administrative-boundary/domain/value-objects/regions/regions-find-one-filter.vo';
import { Observable } from 'rxjs';

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
