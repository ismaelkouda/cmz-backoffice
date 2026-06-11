import { Injectable, inject } from '@angular/core';
import { MunicipalitiesCreateEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-create.entity';
import { MunicipalitiesDeleteEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-delete.entity';
import { MunicipalitiesFilterEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-filter.entity';
import { MunicipalitiesUpdateEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-update.entity';
import { MunicipalitiesEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';
import { MunicipalitiesRepository } from '@pages/administrative-boundary/domain/repositories/municipalities/municipalities-repository';
import { municipalitiesCreateMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-create.mapper';
import { municipalitiesDeleteMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-delete.mapper';
import { municipalitiesFilterMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-filter.mapper';
import { municipalitiesUpdateMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-update.mapper';
import { MunicipalitiesMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities.mapper';
import { MunicipalitiesApi } from '@pages/administrative-boundary/infrastructure/data/sources/municipalities/municipalities.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesRepositoryImpl implements MunicipalitiesRepository {
    private readonly api = inject(MunicipalitiesApi);
    private readonly mapper = inject(MunicipalitiesMapper);

    execute(
        entity: MunicipalitiesFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MunicipalitiesEntity>> {
        const paramsDto = municipalitiesFilterMapper(entity);
        return this.api
            .readAll(paramsDto, page, options)
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
