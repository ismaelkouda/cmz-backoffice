import { Injectable } from '@angular/core';
import { MunicipalitiesFindoneFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-findone-filter.vo';
import { Observable, map } from 'rxjs';
import { MunicipalitiesFindoneEntity } from '../../../../core/domain/entities/municipalities/municipalities-findone.entity';
import { MunicipalitiesFindoneRepository } from '../../../../core/domain/repositories/municipalities/municipalities-findone-repository';
import { MunicipalitiesFindoneMapper } from '../../mappers/municipalities/municipalities-findone.mapper';
import { MunicipalitiesFindoneApi } from '../../sources/municipalities/municipalities-findone.api';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesFindoneRepositoryImpl implements MunicipalitiesFindoneRepository {
    constructor(
        private readonly api: MunicipalitiesFindoneApi,
        private readonly mapper: MunicipalitiesFindoneMapper
    ) { }

    read(filter: MunicipalitiesFindoneFilter | null): Observable<MunicipalitiesFindoneEntity> {
        console.log('filter', filter);
        return this.api
            .read(filter?.toDto() ?? {})
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }


}
