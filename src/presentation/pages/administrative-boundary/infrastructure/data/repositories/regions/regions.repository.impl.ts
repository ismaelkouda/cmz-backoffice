import { Injectable, inject } from '@angular/core';
import { RegionsDeleteDto } from '@pages/administrative-boundary/application/dto/regions/regions-delete.dto';
import { RegionsFilterProps } from '@pages/administrative-boundary/domain/interfaces/regions/regions-filter-props.interface';
import { RegionsEntity } from '@pages/administrative-boundary/domain/entities/regions/regions.entity';
import { RegionsCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-create.validate-contract';
import { RegionsUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-update.validate-contract';
import { RegionsRepository } from '@pages/administrative-boundary/domain/repositories/regions/regions-repository';
import { regionsCreateMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/regions/regions-create.mapper';
import { regionsDeleteMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/regions/regions-delete.mapper';
import { regionsFilterMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/regions/regions-filter.mapper';
import { regionsUpdateMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/regions/regions-update.mapper';
import { RegionsMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/regions/regions.mapper';
import { RegionsApi } from '@pages/administrative-boundary/infrastructure/data/sources/regions/regions.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegionsRepositoryImpl implements RegionsRepository {
    private readonly api = inject(RegionsApi);
    private readonly mapper = inject(RegionsMapper);

    execute(
        filter: RegionsFilterProps,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RegionsEntity>> {
        const paramsDto = regionsFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        vo: RegionsCreateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = regionsCreateMapper(vo);
        return this.api.create(paramsDto);
    }

    update(
        vo: RegionsUpdateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = regionsUpdateMapper(vo);
        return this.api.update(paramsDto);
    }

    delete(dto: RegionsDeleteDto): Observable<SimpleResponseDto<void>> {
        const paramsDto = regionsDeleteMapper(dto);
        return this.api.delete(paramsDto);
    }
}
