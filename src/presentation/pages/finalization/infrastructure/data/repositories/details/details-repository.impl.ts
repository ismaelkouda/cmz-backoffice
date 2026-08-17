import { inject, Injectable } from '@angular/core';
import { DetailsFilterEntity } from '@pages/finalization/domain/entities/details/details-filter.entity';
import { DetailsFinalizeEntity } from '@pages/finalization/domain/entities/details/details-finalize.entity';
import { DetailsTakeEntity } from '@pages/finalization/domain/entities/details/details-take.entity';
import { DetailsEntity } from '@pages/finalization/domain/entities/details/details.entity';
import { DetailsRepository } from '@pages/finalization/domain/repositories/details/details-repository';
import { detailsFilterMapper } from '@pages/finalization/infrastructure/data/mappers/details/details-filter.mapper';
import { detailsFinalizeMapper } from '@pages/finalization/infrastructure/data/mappers/details/details-finalize.mapper';
import { detailsTakeMapper } from '@pages/finalization/infrastructure/data/mappers/details/details-take.mapper';
import { DetailsMapper } from '@pages/finalization/infrastructure/data/mappers/details/details.mapper';
import { DetailsApi } from '@pages/finalization/infrastructure/data/sources/details/details.api';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsRepositoryImpl implements DetailsRepository {
    private readonly api = inject(DetailsApi);
    private readonly mapper = inject(DetailsMapper);

    execute(
        entity: DetailsFilterEntity,
        options?: FetchOptions
    ): Observable<DetailsEntity> {
        const paramsDto = detailsFilterMapper(entity);
        return this.api
            .execute(paramsDto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    take(entity: DetailsTakeEntity): Observable<SimpleResponseDto<void>> {
        return this.api.take(detailsTakeMapper(entity));
    }

    finalize(
        entity: DetailsFinalizeEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.finalize(detailsFinalizeMapper(entity));
    }
}
