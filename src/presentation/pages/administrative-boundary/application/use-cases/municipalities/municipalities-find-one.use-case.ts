import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { MunicipalitiesFindOneFilterDto } from '@presentation/pages/administrative-boundary/application/dto/municipalities/municipalities-find-one-filter.dto';
import { MunicipalitiesFindOneFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one-filter.entity';
import { MunicipalitiesFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';
import { MunicipalitiesFindOneRepository } from '@presentation/pages/administrative-boundary/domain/repositories/municipalities/municipalities-find-one-repository';
import { MunicipalitiesFindOneFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/municipalities/municipalities-find-one-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesFindOneUseCase {
    private readonly repository = inject(MunicipalitiesFindOneRepository);

    execute(
        dto: MunicipalitiesFindOneFilterDto
    ): Observable<MunicipalitiesFindOneEntity> {
        const vo = MunicipalitiesFindOneFilterVo.fromDto(dto);
        const filter = MunicipalitiesFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter);
    }
}
