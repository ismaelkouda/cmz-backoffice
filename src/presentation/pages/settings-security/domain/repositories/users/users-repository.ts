import { Injectable } from '@angular/core';
import { UsersDeleteDto } from '@pages/settings-security/application/dto/users/users-delete.dto';
import { UsersDisableDto } from '@pages/settings-security/application/dto/users/users-disable.dto';
import { UsersEnableDto } from '@pages/settings-security/application/dto/users/users-enable.dto';
import { UsersCreateValidateContract } from '@pages/settings-security/domain/contracts/users/users-create.validate-contract';
import { UsersUpdateValidateContract } from '@pages/settings-security/domain/contracts/users/users-update.validate-contract';
import { UsersEntity } from '@pages/settings-security/domain/entities/users/users.entity';
import { UsersFilterVo } from '@pages/settings-security/domain/value-objects/users/users-filter.vo';
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
        filter: UsersFilterVo | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<UsersEntity>>;
    abstract create(
        props: UsersCreateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        props: UsersUpdateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(dto: UsersDeleteDto): Observable<SimpleResponseDto<void>>;
    abstract enable(dto: UsersEnableDto): Observable<SimpleResponseDto<void>>;
    abstract disable(
        dto: UsersDisableDto
    ): Observable<SimpleResponseDto<void>>;
}
