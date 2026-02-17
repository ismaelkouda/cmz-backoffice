import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsFilterEntity } from '@presentation/pages/finalization/domain/entities/details/details-filter.entity';
import { DetailsFinalizeEntity } from '@presentation/pages/finalization/domain/entities/details/details-finalize.entity';
import { DetailsTakeEntity } from '@presentation/pages/finalization/domain/entities/details/details-take.entity';
import { DetailsEntity } from '@presentation/pages/finalization/domain/entities/details/details.entity';

export abstract class DetailsRepository {
    abstract execute(filter: DetailsFilterEntity): Observable<DetailsEntity>;

    abstract take(
        entity: DetailsTakeEntity
    ): Observable<SimpleResponseDto<void>>;

    abstract finalize(
        entity: DetailsFinalizeEntity
    ): Observable<SimpleResponseDto<void>>;
}
