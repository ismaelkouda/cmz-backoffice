import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { UsersCreateEntity } from '@presentation/pages/settings-security/domain/entities/users/users-create.entity';
import { UsersDeleteEntity } from '@presentation/pages/settings-security/domain/entities/users/users-delete.entity';
import { UsersDisableEntity } from '@presentation/pages/settings-security/domain/entities/users/users-disable.entity';
import { UsersEnableEntity } from '@presentation/pages/settings-security/domain/entities/users/users-enable.entity';
import { UsersFilterEntity } from '@presentation/pages/settings-security/domain/entities/users/users-filter.entity';
import { UsersUpdateEntity } from '@presentation/pages/settings-security/domain/entities/users/users-update.entity';
import { UsersEntity } from '@presentation/pages/settings-security/domain/entities/users/users.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class UsersRepository {
    abstract readAll(
        entity: UsersFilterEntity | null,
        page: string
    ): Observable<Paginate<UsersEntity>>;
    abstract create(
        entity: UsersCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: UsersUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: UsersDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract enable(
        entity: UsersEnableEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract disable(
        entity: UsersDisableEntity
    ): Observable<SimpleResponseDto<void>>;
}
