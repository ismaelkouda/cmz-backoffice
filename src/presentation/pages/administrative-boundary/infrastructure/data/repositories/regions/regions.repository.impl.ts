import { Injectable, inject } from '@angular/core';
import { RegionsRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/regions/regions-repository';
import { RegionsCreate } from '@presentation/pages/administrative-boundary/core/domain/value-objects/regions/regions-create.vo';
import { RegionsFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/regions/regions-filter.vo';
import { RegionsUpdate } from '@presentation/pages/administrative-boundary/core/domain/value-objects/regions/regions-update.vo';
import { Paginate, SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable, map } from 'rxjs';
import { RegionsEntity } from '../../../../core/domain/entities/regions/regions.entity';
import { RegionsCreateMapper } from '../../mappers/regions/regions-create-mapper';
import { RegionsFilterMapper } from '../../mappers/regions/regions-filter-mapper';
import { RegionsUpdateMapper } from '../../mappers/regions/regions-update-mapper';
import { RegionsMapper } from '../../mappers/regions/regions.mapper';
import { RegionsApi } from '../../sources/regions/regions.api';

@Injectable({ providedIn: 'root' })
export class RegionsRepositoryImpl implements RegionsRepository {
    private readonly api = inject(RegionsApi);
    private readonly mapper = inject(RegionsMapper);

    readAll(filter: RegionsFilter, page: string): Observable<Paginate<RegionsEntity>> {
        const paramsDto = RegionsFilterMapper.toApi(filter);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: RegionsCreate): Observable<SimpleResponseDto<void>> {
        const paramsDto = RegionsCreateMapper.toApi(payload);
        return this.api
            .create(paramsDto);
    }

    update(payload: RegionsUpdate): Observable<SimpleResponseDto<void>> {
        const paramsDto = RegionsUpdateMapper.toApi(payload);
        return this.api.update(paramsDto);
    }

    delete(code: string): Observable<SimpleResponseDto<void>> {
        return this.api.delete(code);
    }
}
