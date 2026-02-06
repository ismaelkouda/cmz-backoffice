import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { UsersFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-filter.entity';
import { UsersEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users.entity';
import { UsersRepository } from '@presentation/pages/settings-security/core/domain/repositories/users/users-repository';
import { UsersCreateVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-create.vo';
import { UsersUpdateVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-update.vo';
import { usersCreateMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/users-create.mapper';
import { usersFilterMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/users-filter.mapper';
import { usersUpdateMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/users-update.mapper';
import { UsersMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/users.mapper';
import { UsersApi } from '@presentation/pages/settings-security/infrastructure/data/sources/users/users.api';

@Injectable({
    providedIn: 'root',
})
export class UsersRepositoryImpl implements UsersRepository {
    private readonly api = inject(UsersApi);
    private readonly mapper = inject(UsersMapper);

    readAll(
        filter: UsersFilterEntity,
        page: string
    ): Observable<Paginate<UsersEntity>> {
        const paramsDto = usersFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: UsersCreateVo): Observable<SimpleResponseDto<void>> {
        const paramsDto = usersCreateMapper(payload);
        return this.api.create(paramsDto);
    }

    update(payload: UsersUpdateVo): Observable<SimpleResponseDto<void>> {
        const paramsDto = usersUpdateMapper(payload);
        return this.api.update(paramsDto);
    }

    delete(code: string): Observable<SimpleResponseDto<void>> {
        return this.api.delete(code);
    }

    enable(code: string): Observable<SimpleResponseDto<void>> {
        return this.api.enable(code);
    }

    disable(code: string): Observable<SimpleResponseDto<void>> {
        return this.api.disable(code);
    }
}
