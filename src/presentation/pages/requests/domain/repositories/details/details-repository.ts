import { DetailsApproveEntity } from '@pages/requests/domain/entities/details/details-approve.entity';
import { DetailsFilterEntity } from '@pages/requests/domain/entities/details/details-filter.entity';
import { DetailsRejectEntity } from '@pages/requests/domain/entities/details/details-reject.entity';
import { DetailsTakeEntity } from '@pages/requests/domain/entities/details/details-take.entity';
import { DetailsEntity } from '@pages/requests/domain/entities/details/details.entity';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class DetailsRepository {
    abstract execute(filter: DetailsFilterEntity): Observable<DetailsEntity>;

    abstract take(
        entity: DetailsTakeEntity
    ): Observable<SimpleResponseDto<void>>;

    abstract approve(
        entity: DetailsApproveEntity
    ): Observable<SimpleResponseDto<void>>;

    abstract reject(
        entity: DetailsRejectEntity
    ): Observable<SimpleResponseDto<void>>;
}
