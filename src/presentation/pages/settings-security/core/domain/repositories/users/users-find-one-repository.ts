import { Observable } from 'rxjs';

import { UsersFindOneFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-find-one-filter.entity';
import { UsersFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-find-one.entity';

export abstract class UsersFindOneRepository {
    abstract execute(
        filter: UsersFindOneFilterEntity
    ): Observable<UsersFindOneEntity>;
}
