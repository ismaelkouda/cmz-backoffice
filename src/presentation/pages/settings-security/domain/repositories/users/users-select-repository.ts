import { UsersSelectEntity } from '@pages/settings-security/domain/entities/users/users-select.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class UsersSelectRepository {
    abstract readAll(options?: FetchOptions): Observable<UsersSelectEntity[]>;
}
