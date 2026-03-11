import { inject, Injectable } from '@angular/core';
import { DetailsApproveEntity } from '@pages/requests/domain/entities/details/details-approve.entity';
import { DetailsFilterEntity } from '@pages/requests/domain/entities/details/details-filter.entity';
import { DetailsRejectEntity } from '@pages/requests/domain/entities/details/details-reject.entity';
import { DetailsTakeEntity } from '@pages/requests/domain/entities/details/details-take.entity';
import { DetailsEntity } from '@pages/requests/domain/entities/details/details.entity';
import { DetailsRepository } from '@pages/requests/domain/repositories/details/details-repository';
import { detailsApproveMapper } from '@pages/requests/infrastructure/data/mappers/details/details-approve.mapper';
import { detailsFilterMapper } from '@pages/requests/infrastructure/data/mappers/details/details-filter.mapper';
import { detailsRejectMapper } from '@pages/requests/infrastructure/data/mappers/details/details-reject.mapper';
import { detailsTakeMapper } from '@pages/requests/infrastructure/data/mappers/details/details-take.mapper';
import { DetailsMapper } from '@pages/requests/infrastructure/data/mappers/details/details.mapper';
import { DetailsApi } from '@pages/requests/infrastructure/data/sources/details/details.api';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { map, Observable } from 'rxjs';

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
