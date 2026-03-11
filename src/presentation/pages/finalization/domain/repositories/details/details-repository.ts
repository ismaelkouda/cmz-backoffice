import { DetailsFilterEntity } from '@pages/finalization/domain/entities/details/details-filter.entity';
import { DetailsFinalizeEntity } from '@pages/finalization/domain/entities/details/details-finalize.entity';
import { DetailsTakeEntity } from '@pages/finalization/domain/entities/details/details-take.entity';
import { DetailsEntity } from '@pages/finalization/domain/entities/details/details.entity';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class DetailsRepository {
    abstract execute(filter: DetailsFilterEntity): Observable<DetailsEntity>;

    abstract take(
        entity: DetailsTakeEntity
    ): Observable<SimpleResponseDto<void>>;

    abstract finalize(
        entity: DetailsFinalizeEntity
    ): Observable<SimpleResponseDto<void>>;
}
