import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { UsersStorePayloadEntity } from '../entities/users/users-store-payload.entity';
import { UsersUpdatePayloadEntity } from '../entities/users/users-update-payload.entity';
import { UsersEntity } from '../entities/users/users.entity';
import { UserFilter } from '../value-objects/user-filter.vo';

export abstract class UserRepository {
    abstract fetchUsers(
        filter: UserFilter,
        page: string
    ): Observable<Paginate<UsersEntity>>;

    abstract storeUser(payload: UsersStorePayloadEntity): Observable<UsersEntity>;

    abstract updateUser(payload: UsersUpdatePayloadEntity): Observable<UsersEntity>;

    abstract deleteUser(id: string): Observable<void>;

    abstract enableUser(id: string): Observable<void>;

    abstract disableUser(id: string): Observable<void>;
}
