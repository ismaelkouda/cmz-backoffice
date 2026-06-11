import { Injectable } from '@angular/core';
import { UsersCreateEntity } from '@pages/settings-security/domain/entities/users/users-create.entity';
import { UsersDeleteEntity } from '@pages/settings-security/domain/entities/users/users-delete.entity';
import { UsersDisableEntity } from '@pages/settings-security/domain/entities/users/users-disable.entity';
import { UsersEnableEntity } from '@pages/settings-security/domain/entities/users/users-enable.entity';
import { UsersFilterEntity } from '@pages/settings-security/domain/entities/users/users-filter.entity';
import { UsersUpdateEntity } from '@pages/settings-security/domain/entities/users/users-update.entity';
import { UsersEntity } from '@pages/settings-security/domain/entities/users/users.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class UsersRepository {
    abstract readAll(
        entity: UsersFilterEntity | null,
        page: string,
        options?: FetchOptions
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
