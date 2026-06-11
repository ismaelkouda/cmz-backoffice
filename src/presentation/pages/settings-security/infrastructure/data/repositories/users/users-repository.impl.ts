import { inject, Injectable } from '@angular/core';
import { UsersCreateEntity } from '@pages/settings-security/domain/entities/users/users-create.entity';
import { UsersDeleteEntity } from '@pages/settings-security/domain/entities/users/users-delete.entity';
import { UsersDisableEntity } from '@pages/settings-security/domain/entities/users/users-disable.entity';
import { UsersEnableEntity } from '@pages/settings-security/domain/entities/users/users-enable.entity';
import { UsersFilterEntity } from '@pages/settings-security/domain/entities/users/users-filter.entity';
import { UsersUpdateEntity } from '@pages/settings-security/domain/entities/users/users-update.entity';
import { UsersEntity } from '@pages/settings-security/domain/entities/users/users.entity';
import { UsersRepository } from '@pages/settings-security/domain/repositories/users/users-repository';
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
        entity: UsersFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<UsersEntity>> {
        return this.api
            .readAll(usersFilterMapper(entity), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(entity: UsersCreateEntity): Observable<SimpleResponseDto<void>> {
        return this.api.create(usersCreateMapper(entity));
    }

    update(entity: UsersUpdateEntity): Observable<SimpleResponseDto<void>> {
        return this.api.update(usersUpdateMapper(entity));
    }

    delete(entity: UsersDeleteEntity): Observable<SimpleResponseDto<void>> {
        return this.api.delete(usersDeleteMapper(entity));
    }

    enable(entity: UsersEnableEntity): Observable<SimpleResponseDto<void>> {
        return this.api.enable(usersEnableMapper(entity));
    }

    disable(entity: UsersDisableEntity): Observable<SimpleResponseDto<void>> {
        return this.api.disable(usersDisableMapper(entity));
    }
}
