import { Injectable, inject } from '@angular/core';
import { MunicipalitiesDeleteDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-delete.dto';
import { MunicipalitiesFilterProps } from '@pages/administrative-boundary/domain/interfaces/municipalities/municipalities-filter-props.interface';
import { MunicipalitiesEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';
import { MunicipalitiesCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-create.validate-contract';
import { MunicipalitiesUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-update.validate-contract';
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
        filter: MunicipalitiesFilterProps,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MunicipalitiesEntity>> {
        const paramsDto = municipalitiesFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        entity: MunicipalitiesCreateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = municipalitiesCreateMapper(entity);
        return this.api.create(paramsDto);
    }

    update(
        entity: MunicipalitiesUpdateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = municipalitiesUpdateMapper(entity);
        return this.api.update(paramsDto);
    }

    delete(dto: MunicipalitiesDeleteDto): Observable<SimpleResponseDto<void>> {
        const paramsDto = municipalitiesDeleteMapper(dto);
        return this.api.delete(paramsDto);
    }
}
