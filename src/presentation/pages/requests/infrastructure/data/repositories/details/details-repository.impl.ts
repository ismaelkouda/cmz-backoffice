import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsApproveEntity } from '@presentation/pages/requests/domain/entities/details/details-approve.entity';
import { DetailsFilterEntity } from '@presentation/pages/requests/domain/entities/details/details-filter.entity';
import { DetailsRejectEntity } from '@presentation/pages/requests/domain/entities/details/details-reject.entity';
import { DetailsTakeEntity } from '@presentation/pages/requests/domain/entities/details/details-take.entity';
import { DetailsEntity } from '@presentation/pages/requests/domain/entities/details/details.entity';
import { DetailsRepository } from '@presentation/pages/requests/domain/repositories/details/details-repository';
import { detailsApproveMapper } from '@presentation/pages/requests/infrastructure/data/mappers/details/details-approve.mapper';
import { detailsFilterMapper } from '@presentation/pages/requests/infrastructure/data/mappers/details/details-filter.mapper';
import { detailsRejectMapper } from '@presentation/pages/requests/infrastructure/data/mappers/details/details-reject.mapper';
import { detailsTakeMapper } from '@presentation/pages/requests/infrastructure/data/mappers/details/details-take.mapper';
import { DetailsMapper } from '@presentation/pages/requests/infrastructure/data/mappers/details/details.mapper';
import { DetailsApi } from '@presentation/pages/requests/infrastructure/data/sources/details/details.api';

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

    approve(entity: DetailsApproveEntity): Observable<SimpleResponseDto<void>> {
        return this.api.approve(detailsApproveMapper(entity));
    }

    reject(entity: DetailsRejectEntity): Observable<SimpleResponseDto<void>> {
        return this.api.reject(detailsRejectMapper(entity));
    }
}
