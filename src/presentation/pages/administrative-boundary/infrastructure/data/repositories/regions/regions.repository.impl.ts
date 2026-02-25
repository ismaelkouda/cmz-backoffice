import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { RegionsCreateEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-create.entity';
import { RegionsDeleteEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-delete.entity';
import { RegionsFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-filter.entity';
import { RegionsUpdateEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-update.entity';
import { RegionsEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions.entity';
import { RegionsRepository } from '@presentation/pages/administrative-boundary/domain/repositories/regions/regions-repository';
import { regionsCreateMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/regions-create.mapper';
import { regionsDeleteMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/regions-delete.mapper';
import { regionsFilterMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/regions-filter.mapper';
import { regionsUpdateMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/regions-update.mapper';
import { RegionsMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/regions.mapper';
import { RegionsApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/regions/regions.api';

@Injectable({ providedIn: 'root' })
export class RegionsRepositoryImpl implements RegionsRepository {
    private readonly api = inject(RegionsApi);
    private readonly mapper = inject(RegionsMapper);

    execute(
        filter: RegionsFilterEntity,
        page: string
    ): Observable<Paginate<RegionsEntity>> {
        const paramsDto = regionsFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page)
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
