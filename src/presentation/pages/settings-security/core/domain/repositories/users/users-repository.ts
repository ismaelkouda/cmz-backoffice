import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { UsersCreateEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-create.entity';
import { UsersFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-filter.entity';
import { UsersUpdateEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-update.entity';
import { UsersEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class UsersRepository {
    abstract readAll(
        filter: UsersFilterEntity | null,
        page: string
    ): Observable<Paginate<UsersEntity>>;
    abstract create(
        payload: UsersCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        payload: UsersUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(uniqId: string): Observable<SimpleResponseDto<void>>;
    abstract enable(uniqId: string): Observable<SimpleResponseDto<void>>;
    abstract disable(uniqId: string): Observable<SimpleResponseDto<void>>;
}
