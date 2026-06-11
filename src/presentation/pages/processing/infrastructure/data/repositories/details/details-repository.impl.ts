import { inject, Injectable } from '@angular/core';
import { DetailsFilterEntity } from '@pages/processing/domain/entities/details/details-filter.entity';
import { DetailsTakeEntity } from '@pages/processing/domain/entities/details/details-take.entity';
import { DetailsTreatEntity } from '@pages/processing/domain/entities/details/details-treat.entity';
import { DetailsEntity } from '@pages/processing/domain/entities/details/details.entity';
import { DetailsRepository } from '@pages/processing/domain/repositories/details/details-repository';
import { detailsFilterMapper } from '@pages/processing/infrastructure/data/mappers/details/details-filter.mapper';
import { detailsTakeMapper } from '@pages/processing/infrastructure/data/mappers/details/details-take.mapper';
import { detailsTreatMapper } from '@pages/processing/infrastructure/data/mappers/details/details-treat.mapper';
import { DetailsMapper } from '@pages/processing/infrastructure/data/mappers/details/details.mapper';
import { DetailsApi } from '@pages/processing/infrastructure/data/sources/details/details.api';
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

    treat(entity: DetailsTreatEntity): Observable<SimpleResponseDto<void>> {
        return this.api.treat(detailsTreatMapper(entity));
    }
}
