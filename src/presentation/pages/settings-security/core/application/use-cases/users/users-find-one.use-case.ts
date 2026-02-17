import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { UsersFindOneFilterDto } from '@presentation/pages/settings-security/core/application/dto/users/users-find-one-filter.dto';
import { UsersFindOneFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-find-one-filter.entity';
import { UsersFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-find-one.entity';
import { UsersFindOneRepository } from '@presentation/pages/settings-security/core/domain/repositories/users/users-find-one-repository';
import { UsersFindOneFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-find-one-filter.vo';

export class UsersFindOneUseCase {
    private readonly repository = inject(UsersFindOneRepository);

    execute(filterDto: UsersFindOneFilterDto): Observable<UsersFindOneEntity> {
        const vo = UsersFindOneFilterVo.fromDto(filterDto);
        const filter = UsersFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter);
    }
}
