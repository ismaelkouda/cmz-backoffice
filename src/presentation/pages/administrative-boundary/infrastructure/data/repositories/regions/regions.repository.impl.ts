import { Injectable, inject } from '@angular/core';
import { RegionsCreateEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-create.entity';
import { RegionsDeleteEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-delete.entity';
import { RegionsFilterEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-filter.entity';
import { RegionsUpdateEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-update.entity';
import { RegionsEntity } from '@pages/administrative-boundary/domain/entities/regions/regions.entity';
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
        filter: RegionsFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RegionsEntity>> {
        const paramsDto = regionsFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(vo: RegionsCreateEntity): Observable<SimpleResponseDto<void>> {
        const paramsDto = regionsCreateMapper(vo);
        return this.api.create(paramsDto);
    }

    update(vo: RegionsUpdateEntity): Observable<SimpleResponseDto<void>> {
        const paramsDto = regionsUpdateMapper(vo);
        return this.api.update(paramsDto);
    }

    delete(vo: RegionsDeleteEntity): Observable<SimpleResponseDto<void>> {
        const paramsDto = regionsDeleteMapper(vo);
        return this.api.delete(paramsDto);
    }
}
