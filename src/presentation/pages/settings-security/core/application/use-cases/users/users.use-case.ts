import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { UsersCreateDto } from '@presentation/pages/settings-security/core/application/dto/users/users-create.dto';
import { UsersDeleteDto } from '@presentation/pages/settings-security/core/application/dto/users/users-delete.dto';
import { UsersDisableDto } from '@presentation/pages/settings-security/core/application/dto/users/users-disable.dto';
import { UsersEnableDto } from '@presentation/pages/settings-security/core/application/dto/users/users-enable.dto';
import { UsersFilterDto } from '@presentation/pages/settings-security/core/application/dto/users/users-filter.dto';
import { UsersUpdateDto } from '@presentation/pages/settings-security/core/application/dto/users/users-update.dto';
import { UsersCreateEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-create.entity';
import { UsersDeleteEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-delete.entity';
import { UsersDisableEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-disable.entity';
import { UsersEnableEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-enable.entity';
import { UsersFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-filter.entity';
import { UsersUpdateEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-update.entity';
import { UsersEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users.entity';
import { UsersRepository } from '@presentation/pages/settings-security/core/domain/repositories/users/users-repository';
import { UsersCreateVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-create.vo';
import { UsersDeleteVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-delete.vo';
import { UsersDisableVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-disable.vo';
import { UsersEnableVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-enable.vo';
import { UsersFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-filter.vo';
import { UsersUpdateVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-update.vo';

@Injectable({
    providedIn: 'root',
})
export class UsersUseCase {
    private readonly repository = inject(UsersRepository);

    execute(
        dto: UsersFilterDto | null,
        page: string
    ): Observable<Paginate<UsersEntity>> {
        const vo = UsersFilterVo.fromDto(dto);
        const entity = UsersFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
    }

    create(dto: UsersCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = UsersCreateVo.fromDto(dto);
        const entity = UsersCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(dto: UsersUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = UsersUpdateVo.fromDto(dto);
        const entity = UsersUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    delete(dto: UsersDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = UsersDeleteVo.fromDto(dto);
        const entity = UsersDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }

    enable(dto: UsersEnableDto): Observable<SimpleResponseDto<void>> {
        const vo = UsersEnableVo.fromDto(dto);
        const entity = UsersEnableEntity.fromVo(vo);
        return this.repository.enable(entity);
    }

    disable(dto: UsersDisableDto): Observable<SimpleResponseDto<void>> {
        const vo = UsersDisableVo.fromDto(dto);
        const entity = UsersDisableEntity.fromVo(vo);
        return this.repository.disable(entity);
    }
}
