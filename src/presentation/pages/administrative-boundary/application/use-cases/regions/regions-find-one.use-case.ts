import { Injectable, inject } from '@angular/core';
import { RegionsFindOneEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';
import { RegionsFindOneRepository } from '@pages/administrative-boundary/domain/repositories/regions/regions-find-one-repository';
import { regionsFindOneFilterVo } from '@pages/administrative-boundary/domain/value-objects/regions/regions-find-one-filter.vo';
import { defer, Observable } from 'rxjs';

import { RegionsFindOneFilterDto } from '../../dto/regions/regions-find-one-filter.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class RegionsFindOneUseCase {
    private readonly repository = inject(RegionsFindOneRepository);

    execute(
        filterDto: RegionsFindOneFilterDto,
        options?: FetchOptions
    ): Observable<RegionsFindOneEntity> {
        return defer(() =>
            this.repository.execute(regionsFindOneFilterVo(filterDto), options)
        );
    }
}
