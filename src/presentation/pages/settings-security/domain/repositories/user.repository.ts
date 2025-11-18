import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { UserFilter } from '../value-objects/user-filter.vo';
import {
    UserStoreRequestDto,
    UserUpdateRequestDto,
    UserDeleteResponseDto,
    UserEnableResponseDto,
    UserDisableResponseDto,
} from '@presentation/pages/settings-security/data/dtos/user-response.dto';

export abstract class UserRepository {
    abstract fetchUsers(
        filter: UserFilter,
        page: string
    ): Observable<Paginate<User>>;

    abstract storeUser(
        payload: UserStoreRequestDto
    ): Observable<User>;

    abstract updateUser(
        payload: UserUpdateRequestDto
    ): Observable<User>;

    abstract deleteUser(id: string): Observable<UserDeleteResponseDto>;

    abstract enableUser(id: string): Observable<UserEnableResponseDto>;

    abstract disableUser(id: string): Observable<UserDisableResponseDto>;
}
