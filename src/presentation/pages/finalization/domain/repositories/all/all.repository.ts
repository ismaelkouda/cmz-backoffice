import { AllFilterEntity } from '@pages/finalization/domain/entities/all/all-filter.entity';
import { AllEntity } from '@pages/finalization/domain/entities/all/all.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class AllRepository {
    abstract execute(
        entity: AllFilterEntity | null,
        page: string
    ): Observable<Paginate<AllEntity>>;
}
