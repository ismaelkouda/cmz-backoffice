import { UsersSelectEntity } from '@pages/settings-security/domain/entities/users/users-select.entity';
import { Observable } from 'rxjs';

export abstract class UsersSelectRepository {
    abstract readAll(): Observable<UsersSelectEntity[]>;
}
