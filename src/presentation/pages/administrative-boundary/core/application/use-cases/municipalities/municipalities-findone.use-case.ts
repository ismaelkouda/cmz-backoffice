import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { MunicipalitiesFindoneFilterDto } from '@presentation/pages/administrative-boundary/core/application/dtos/municipalities/municipalities-findone-filter.dto';
import { MunicipalitiesFindoneEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/municipalities/municipalities-findone.entity';
import { MunicipalitiesFindoneRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/municipalities/municipalities-findone-repository';
import { MunicipalitiesFindoneFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-findone-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesFindoneUseCase {
    private readonly repository = inject(MunicipalitiesFindoneRepository);

    read(
        filterDto: MunicipalitiesFindoneFilterDto
    ): Observable<MunicipalitiesFindoneEntity> {
        const filter = MunicipalitiesFindoneFilter.create(filterDto);
        return this.repository.read(filter);
    }
}
