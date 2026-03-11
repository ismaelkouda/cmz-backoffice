import { inject, Injectable } from '@angular/core';
import { UsersCreateDto } from '@pages/settings-security/application/dto/users/users-create.dto';
import { UsersDeleteDto } from '@pages/settings-security/application/dto/users/users-delete.dto';
import { UsersDisableDto } from '@pages/settings-security/application/dto/users/users-disable.dto';
import { UsersEnableDto } from '@pages/settings-security/application/dto/users/users-enable.dto';
import { UsersFilterDto } from '@pages/settings-security/application/dto/users/users-filter.dto';
import { UsersUpdateDto } from '@pages/settings-security/application/dto/users/users-update.dto';
import { UsersCreateEntity } from '@pages/settings-security/domain/entities/users/users-create.entity';
import { UsersDeleteEntity } from '@pages/settings-security/domain/entities/users/users-delete.entity';
import { UsersDisableEntity } from '@pages/settings-security/domain/entities/users/users-disable.entity';
import { UsersEnableEntity } from '@pages/settings-security/domain/entities/users/users-enable.entity';
import { UsersFilterEntity } from '@pages/settings-security/domain/entities/users/users-filter.entity';
import { UsersUpdateEntity } from '@pages/settings-security/domain/entities/users/users-update.entity';
import { UsersEntity } from '@pages/settings-security/domain/entities/users/users.entity';
import { UsersRepository } from '@pages/settings-security/domain/repositories/users/users-repository';
import { UsersCreateVo } from '@pages/settings-security/domain/value-objects/users/users-create.vo';
import { UsersDeleteVo } from '@pages/settings-security/domain/value-objects/users/users-delete.vo';
import { UsersDisableVo } from '@pages/settings-security/domain/value-objects/users/users-disable.vo';
import { UsersEnableVo } from '@pages/settings-security/domain/value-objects/users/users-enable.vo';
import { UsersFilterVo } from '@pages/settings-security/domain/value-objects/users/users-filter.vo';
import { UsersUpdateVo } from '@pages/settings-security/domain/value-objects/users/users-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
