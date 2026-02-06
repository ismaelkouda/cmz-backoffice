import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { UsersCreateDto } from '@presentation/pages/settings-security/core/application/dtos/users/users-create.dto';
import { UsersFilterDto } from '@presentation/pages/settings-security/core/application/dtos/users/users-filter.dto';
import { UsersUpdateDto } from '@presentation/pages/settings-security/core/application/dtos/users/users-update.dto';
import { UsersCreateEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-create.entity';
import { UsersFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-filter.entity';
import { UsersUpdateEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-update.entity';
import { UsersEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users.entity';
import { UsersRepository } from '@presentation/pages/settings-security/core/domain/repositories/users/users-repository';
import { UsersCreateVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-create.vo';
import { UsersFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-filter.vo';
import { UsersUpdateVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-update.vo';

@Injectable({
    providedIn: 'root',
})
export class UsersUseCase {
    private readonly repository = inject(UsersRepository);

    readAll(
        filterDto: UsersFilterDto | null,
        page: string
    ): Observable<Paginate<UsersEntity>> {
        const vo = UsersFilterVo.fromDto(filterDto);
        const entity = UsersFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
    }

    create(createDto: UsersCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = UsersCreateVo.fromDto(createDto);
        const entity = UsersCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(updateDto: UsersUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = UsersUpdateVo.fromDto(updateDto);
        const entity = UsersUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    delete(code: string): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(code);
    }

    enable(id: string): Observable<SimpleResponseDto<void>> {
        return this.repository.enable(id);
    }

    disable(id: string): Observable<SimpleResponseDto<void>> {
        return this.repository.disable(id);
    }
}
