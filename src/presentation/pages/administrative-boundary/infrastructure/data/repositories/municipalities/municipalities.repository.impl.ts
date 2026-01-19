import { Injectable } from '@angular/core';
import { MunicipalitiesEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/municipalities/municipalities.entity';
import { MunicipalitiesRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/municipalities/municipalities-repository';
import { MunicipalitiesCreate } from '@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-create.vo';
import { MunicipalitiesFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-filter.vo';
import { MunicipalitiesUpdate } from '@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-update.vo';
import { MunicipalitiesApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/municipalities/municipalities.api';
import { Paginate, SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable, map } from 'rxjs';
import { MunicipalitiesCreateMapper } from '../../mappers/municipalities/municipalities-create-mapper';
import { MunicipalitiesFilterMapper } from '../../mappers/municipalities/municipalities-filter-mapper';
import { MunicipalitiesUpdateMapper } from '../../mappers/municipalities/municipalities-update-mapper';
import { MunicipalitiesMapper } from '../../mappers/municipalities/municipalities.mapper';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesRepositoryImpl implements MunicipalitiesRepository {
    constructor(
        private readonly api: MunicipalitiesApi,
        private readonly mapper: MunicipalitiesMapper
    ) { }

    readAll(filter: MunicipalitiesFilter, page: string): Observable<Paginate<MunicipalitiesEntity>> {
        const params = MunicipalitiesFilterMapper.toApi(filter);
        return this.api
            .readAll(params, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: MunicipalitiesCreate): Observable<SimpleResponseDto<void>> {
        const params = MunicipalitiesCreateMapper.toApi(payload);
        return this.api.create(params);
    }

    update(payload: MunicipalitiesUpdate): Observable<SimpleResponseDto<void>> {
        const params = MunicipalitiesUpdateMapper.toApi(payload);
        return this.api.update(params);
    }

    delete(code: string): Observable<SimpleResponseDto<void>> {
        return this.api.delete(code);
    }


}
