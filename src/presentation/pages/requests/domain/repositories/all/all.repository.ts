import { AllFilterEntity } from '@pages/requests/domain/entities/all/all-filter.entity';
import { AllEntity } from '@pages/requests/domain/entities/all/all.entity';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class AllRepository {
    abstract execute(
        entity: AllFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AllEntity>>;
}
