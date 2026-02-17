import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsFilterEntity } from '@presentation/pages/processing/domain/entities/details/details-filter.entity';
import { DetailsTakeEntity } from '@presentation/pages/processing/domain/entities/details/details-take.entity';
import { DetailsTreatEntity } from '@presentation/pages/processing/domain/entities/details/details-treat.entity';
import { DetailsEntity } from '@presentation/pages/processing/domain/entities/details/details.entity';
import { DetailsRepository } from '@presentation/pages/processing/domain/repositories/details/details-repository';
import { detailsFilterMapper } from '@presentation/pages/processing/infrastructure/data/mappers/details/details-filter.mapper';
import { detailsTakeMapper } from '@presentation/pages/processing/infrastructure/data/mappers/details/details-take.mapper';
import { detailsTreatMapper } from '@presentation/pages/processing/infrastructure/data/mappers/details/details-treat.mapper';
import { DetailsMapper } from '@presentation/pages/processing/infrastructure/data/mappers/details/details.mapper';
import { DetailsApi } from '@presentation/pages/processing/infrastructure/data/sources/details/details.api';

@Injectable({ providedIn: 'root' })
export class DetailsRepositoryImpl implements DetailsRepository {
    private readonly api = inject(DetailsApi);
    private readonly mapper = inject(DetailsMapper);

    execute(entity: DetailsFilterEntity): Observable<DetailsEntity> {
        const paramsDto = detailsFilterMapper(entity);
        return this.api
            .execute(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    take(entity: DetailsTakeEntity): Observable<SimpleResponseDto<void>> {
        return this.api.take(detailsTakeMapper(entity));
    }

    treat(entity: DetailsTreatEntity): Observable<SimpleResponseDto<void>> {
        return this.api.treat(detailsTreatMapper(entity));
    }
}
