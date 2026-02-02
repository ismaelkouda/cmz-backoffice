import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { UsersFindOneFilterDto } from '@presentation/pages/settings-security/core/application/dtos/users/users-findone-filter.dto';
import { UsersFindOneFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-findone-filter.entity';
import { UsersFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-findone.entity';
import { UsersFindonRepository } from '@presentation/pages/settings-security/core/domain/repositories/users/users-findone-repository';
import { UsersFindOneFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-findone-filter.vo';

export class UsersFindonUseCase {
    private readonly repository = inject(UsersFindonRepository);

    read(filterDto: UsersFindOneFilterDto): Observable<UsersFindOneEntity> {
        const vo = UsersFindOneFilterVo.fromDto(filterDto);
        const filter = UsersFindOneFilterEntity.fromVo(vo);
        return this.repository.read(filter);
    }
}
