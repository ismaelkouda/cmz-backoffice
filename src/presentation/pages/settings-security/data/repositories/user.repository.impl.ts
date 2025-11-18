import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Paginate } from '@shared/interfaces/paginate';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserFilter } from '../../domain/value-objects/user-filter.vo';
import { UserApi } from '../sources/user.api';
import { UserMapper } from '../mappers/user.mapper';
import {
    UserStoreRequestDto,
    UserUpdateRequestDto,
    UserDeleteResponseDto,
    UserEnableResponseDto,
    UserDisableResponseDto,
} from '../dtos/user-response.dto';

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

    fetchUsers(filter: UserFilter, page: string): Observable<Paginate<User>> {
        return this.userApi
            .fetchUsers(filter.toDto(), page)
            .pipe(map((response) => this.userMapper.mapFromDto(response)));
    }

    storeUser(payload: UserStoreRequestDto): Observable<User> {
        return this.userApi.storeUser(payload);
    }

    updateUser(payload: UserUpdateRequestDto): Observable<User> {
        return this.userApi.updateUser(payload);
    }

    deleteUser(id: string): Observable<UserDeleteResponseDto> {
        return this.userApi.deleteUser(id);
    }

    enableUser(id: string): Observable<UserEnableResponseDto> {
        return this.userApi.enableUser(id);
    }

    disableUser(id: string): Observable<UserDisableResponseDto> {
        return this.userApi.disableUser(id);
    }
}
