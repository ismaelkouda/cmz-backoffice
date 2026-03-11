import { UsersFindOneFilterEntity } from '@pages/settings-security/domain/entities/users/users-find-one-filter.entity';
import { UsersFindOneEntity } from '@pages/settings-security/domain/entities/users/users-find-one.entity';
import { Observable } from 'rxjs';

export abstract class UsersFindOneRepository {
    abstract execute(
        filter: UsersFindOneFilterEntity
    ): Observable<UsersFindOneEntity>;
}
