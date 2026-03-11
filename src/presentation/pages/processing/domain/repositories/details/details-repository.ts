import { DetailsFilterEntity } from '@pages/processing/domain/entities/details/details-filter.entity';
import { DetailsTakeEntity } from '@pages/processing/domain/entities/details/details-take.entity';
import { DetailsTreatEntity } from '@pages/processing/domain/entities/details/details-treat.entity';
import { DetailsEntity } from '@pages/processing/domain/entities/details/details.entity';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class DetailsRepository {
    abstract execute(filter: DetailsFilterEntity): Observable<DetailsEntity>;

    abstract take(
        entity: DetailsTakeEntity
    ): Observable<SimpleResponseDto<void>>;

    abstract treat(
        entity: DetailsTreatEntity
    ): Observable<SimpleResponseDto<void>>;
}
