import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesCreateEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-create.entity';
import { MunicipalitiesDeleteEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-delete.entity';
import { MunicipalitiesFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-filter.entity';
import { MunicipalitiesUpdateEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-update.entity';
import { MunicipalitiesEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';
import { MunicipalitiesRepository } from '@presentation/pages/administrative-boundary/domain/repositories/municipalities/municipalities-repository';
import { municipalitiesCreateMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-create.mapper';
import { municipalitiesDeleteMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-delete.mapper';
import { municipalitiesFilterMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-filter.mapper';
import { municipalitiesUpdateMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-update.mapper';
import { MunicipalitiesMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities.mapper';
import { MunicipalitiesApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/municipalities/municipalities.api';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesRepositoryImpl implements MunicipalitiesRepository {
    private readonly api = inject(MunicipalitiesApi);
    private readonly mapper = inject(MunicipalitiesMapper);

    execute(
        entity: MunicipalitiesFilterEntity,
        page: string
    ): Observable<Paginate<MunicipalitiesEntity>> {
        const paramsDto = municipalitiesFilterMapper(entity);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        entity: MunicipalitiesCreateEntity
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = municipalitiesCreateMapper(entity);
        return this.api.create(paramsDto);
    }

    update(
        entity: MunicipalitiesUpdateEntity
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = municipalitiesUpdateMapper(entity);
        return this.api.update(paramsDto);
    }

    delete(
        entity: MunicipalitiesDeleteEntity
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = municipalitiesDeleteMapper(entity);
        return this.api.delete(paramsDto);
    }
}
