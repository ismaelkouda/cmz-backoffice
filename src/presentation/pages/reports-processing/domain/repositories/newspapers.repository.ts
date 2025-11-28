import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { NewspapersEntity } from '../entities/management/newspapers/newspapers.entity';
import { NewspapersFilter } from '../value-objects/newspapers-filter.vo';

export abstract class NewspapersRepository {
    abstract fetchNewspapers(
        filter: NewspapersFilter,
        page: string
    ): Observable<Paginate<NewspapersEntity>>;
}
