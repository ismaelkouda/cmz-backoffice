import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { MunicipalitiesEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/municipalities/municipalities.entity';
import { MunicipalitiesRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/municipalities/municipalities-repository';
import { MunicipalitiesCreate } from '@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-create.vo';
import { MunicipalitiesFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-filter.vo';
import { MunicipalitiesUpdate } from '@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-update.vo';
import { MunicipalitiesApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/municipalities/municipalities.api';

import { municipalitiesCreateMapper } from '../../mappers/municipalities/municipalities-create-mapper';
import { municipalitiesFilterMapper } from '../../mappers/municipalities/municipalities-filter-mapper';
import { municipalitiesUpdateMapper } from '../../mappers/municipalities/municipalities-update-mapper';
import { MunicipalitiesMapper } from '../../mappers/municipalities/municipalities.mapper';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesRepositoryImpl implements MunicipalitiesRepository {
    constructor(
        private readonly api: MunicipalitiesApi,
        private readonly mapper: MunicipalitiesMapper
    ) {}

    readAll(
        filter: MunicipalitiesFilter,
        page: string
    ): Observable<Paginate<MunicipalitiesEntity>> {
        const params = municipalitiesFilterMapper(filter);
        return this.api
            .readAll(params, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: MunicipalitiesCreate): Observable<SimpleResponseDto<void>> {
        const params = municipalitiesCreateMapper(payload);
        return this.api.create(params);
    }

    update(payload: MunicipalitiesUpdate): Observable<SimpleResponseDto<void>> {
        const params = municipalitiesUpdateMapper(payload);
        return this.api.update(params);
    }

    delete(code: string): Observable<SimpleResponseDto<void>> {
        return this.api.delete(code);
    }
}
