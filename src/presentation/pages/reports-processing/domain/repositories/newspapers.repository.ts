import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { NewspapersEntity } from '../entities/management/newspapers/newspapers.entity';
import { NewspapersFilter } from '../value-objects/newspapers-filter.vo';

export abstract class NewspapersRepository {
    abstract fetchNewspapers(
        filter: NewspapersFilter,
        page: string
    ): Observable<Paginate<NewspapersEntity>>;
}
