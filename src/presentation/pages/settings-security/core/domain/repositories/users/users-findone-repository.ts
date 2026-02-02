import { Observable } from 'rxjs';

import { UsersFindOneFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-findone-filter.entity';
import { UsersFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-findone.entity';

export abstract class UsersFindonRepository {
    abstract read(
        filter: UsersFindOneFilterEntity
    ): Observable<UsersFindOneEntity>;
}
