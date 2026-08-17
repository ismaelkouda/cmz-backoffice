import { inject, Injectable } from '@angular/core';
import { UsersDeleteDto } from '@pages/settings-security/application/dto/users/users-delete.dto';
import { UsersDisableDto } from '@pages/settings-security/application/dto/users/users-disable.dto';
import { UsersEnableDto } from '@pages/settings-security/application/dto/users/users-enable.dto';
import { UsersCreateValidateContract } from '@pages/settings-security/domain/contracts/users/users-create.validate-contract';
import { UsersUpdateValidateContract } from '@pages/settings-security/domain/contracts/users/users-update.validate-contract';
import { UsersEntity } from '@pages/settings-security/domain/entities/users/users.entity';
import { UsersRepository } from '@pages/settings-security/domain/repositories/users/users-repository';
import { UsersFilterVo } from '@pages/settings-security/domain/value-objects/users/users-filter.vo';
import { usersCreateMapper } from '@pages/settings-security/infrastructure/data/mappers/users/users-create.mapper';
import { usersDeleteMapper } from '@pages/settings-security/infrastructure/data/mappers/users/users-delete.mapper';
import { usersDisableMapper } from '@pages/settings-security/infrastructure/data/mappers/users/users-disable.mapper';
import { usersEnableMapper } from '@pages/settings-security/infrastructure/data/mappers/users/users-enable.mapper';
import { usersFilterMapper } from '@pages/settings-security/infrastructure/data/mappers/users/users-filter.mapper';
import { usersUpdateMapper } from '@pages/settings-security/infrastructure/data/mappers/users/users-update.mapper';
import { UsersMapper } from '@pages/settings-security/infrastructure/data/mappers/users/users.mapper';
import { UsersApi } from '@pages/settings-security/infrastructure/data/sources/users/users.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersRepositoryImpl implements UsersRepository {
    private readonly api = inject(UsersApi);
    private readonly mapper = inject(UsersMapper);

    readAll(
        filter: UsersFilterVo,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<UsersEntity>> {
        return this.api
            .readAll(usersFilterMapper(filter), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        props: UsersCreateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(usersCreateMapper(props));
    }

    update(
        props: UsersUpdateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(usersUpdateMapper(props));
    }

    delete(dto: UsersDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.api.delete(usersDeleteMapper(dto));
    }

    enable(dto: UsersEnableDto): Observable<SimpleResponseDto<void>> {
        return this.api.enable(usersEnableMapper(dto));
    }

    disable(dto: UsersDisableDto): Observable<SimpleResponseDto<void>> {
        return this.api.disable(usersDisableMapper(dto));
    }
}
