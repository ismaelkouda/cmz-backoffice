import { Observable } from 'rxjs';

import { UsersSelectEntity } from '@presentation/pages/settings-security/domain/entities/users/users-select.entity';

export abstract class UsersSelectRepository {
    abstract readAll(): Observable<UsersSelectEntity[]>;
}
