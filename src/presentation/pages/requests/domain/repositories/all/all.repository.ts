import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AllFilterEntity } from '@presentation/pages/requests/domain/entities/all/all-filter.entity';
import { AllEntity } from '@presentation/pages/requests/domain/entities/all/all.entity';

export abstract class AllRepository {
    abstract execute(
        entity: AllFilterEntity | null,
        page: string
    ): Observable<Paginate<AllEntity>>;
}
