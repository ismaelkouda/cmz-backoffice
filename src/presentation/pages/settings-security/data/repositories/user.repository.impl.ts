/* import { Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, map } from 'rxjs';
import { UsersStorePayloadEntity } from '../../domain/entities/users/users-store-payload.entity';
import { UsersUpdatePayloadEntity } from '../../domain/entities/users/users-update-payload.entity';
import { UsersEntity } from '../../domain/entities/users/users.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserFilter } from '../../domain/value-objects/user-filter.vo';
import { UserMapper } from '../mappers/user.mapper';
import { UserApi } from '../sources/user.api';

@Injectable({
    providedIn: 'root',
})
export class UserRepositoryImpl extends UserRepository {
    constructor(
        private readonly userApi: UserApi,
        private readonly userMapper: UserMapper
    ) {
        super();
    }

    fetchUsers(filter: UserFilter, page: string): Observable<Paginate<UsersEntity>> {
        return this.userApi
            .fetchUsers(filter.toDto(), page)
            .pipe(map((response) => this.userMapper.mapFromDto(response)));
    }

    storeUser(payload: UsersStorePayloadEntity): Observable<UsersEntity> {
        return this.userApi.storeUser(payload);
    }

    updateUser(payload: UsersUpdatePayloadEntity): Observable<UsersEntity> {
        return this.userApi.updateUser(payload);
    }

    deleteUser(id: string): Observable<void> {
        return this.userApi.deleteUser(id);
    }

    enableUser(id: string): Observable<void> {
        return this.userApi.enableUser(id);
    }

    disableUser(id: string): Observable<void> {
        return this.userApi.disableUser(id);
    }
}
 */
