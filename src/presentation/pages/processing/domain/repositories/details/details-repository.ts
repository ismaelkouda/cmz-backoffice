import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsFilterEntity } from '@presentation/pages/processing/domain/entities/details/details-filter.entity';
import { DetailsTakeEntity } from '@presentation/pages/processing/domain/entities/details/details-take.entity';
import { DetailsTreatEntity } from '@presentation/pages/processing/domain/entities/details/details-treat.entity';
import { DetailsEntity } from '@presentation/pages/processing/domain/entities/details/details.entity';

export abstract class DetailsRepository {
    abstract execute(filter: DetailsFilterEntity): Observable<DetailsEntity>;

    abstract take(
        entity: DetailsTakeEntity
    ): Observable<SimpleResponseDto<void>>;

    abstract treat(
        entity: DetailsTreatEntity
    ): Observable<SimpleResponseDto<void>>;
}
