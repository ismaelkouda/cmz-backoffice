import { inject, Injectable } from '@angular/core';
import { UsersDeleteDto } from '@pages/settings-security/application/dto/users/users-delete.dto';
import { UsersDisableDto } from '@pages/settings-security/application/dto/users/users-disable.dto';
import { UsersEnableDto } from '@pages/settings-security/application/dto/users/users-enable.dto';
import { UsersFilterDto } from '@pages/settings-security/application/dto/users/users-filter.dto';
import { UsersCreateContract } from '@pages/settings-security/domain/contracts/users/users-create.contract';
import { UsersUpdateContract } from '@pages/settings-security/domain/contracts/users/users-update.contract';
import { UsersEntity } from '@pages/settings-security/domain/entities/users/users.entity';
import { UsersRepository } from '@pages/settings-security/domain/repositories/users/users-repository';
import { usersCreateVo } from '@pages/settings-security/domain/value-objects/users/users-create.vo';
import { usersDeleteVo } from '@pages/settings-security/domain/value-objects/users/users-delete.vo';
import { usersDisableVo } from '@pages/settings-security/domain/value-objects/users/users-disable.vo';
import { usersEnableVo } from '@pages/settings-security/domain/value-objects/users/users-enable.vo';
import { usersFilterVo } from '@pages/settings-security/domain/value-objects/users/users-filter.vo';
import { usersUpdateVo } from '@pages/settings-security/domain/value-objects/users/users-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersUseCase {
    private readonly repository = inject(UsersRepository);

    execute(
        dto: UsersFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<UsersEntity>> {
        return this.repository.readAll(usersFilterVo(dto), page, options);
    }

    create(dto: UsersCreateContract): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.create(usersCreateVo(dto)));
    }

    update(dto: UsersUpdateContract): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.update(usersUpdateVo(dto)));
    }

    delete(dto: UsersDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(usersDeleteVo(dto));
    }

    enable(dto: UsersEnableDto): Observable<SimpleResponseDto<void>> {
        return this.repository.enable(usersEnableVo(dto));
    }

    disable(dto: UsersDisableDto): Observable<SimpleResponseDto<void>> {
        return this.repository.disable(usersDisableVo(dto));
    }
}
