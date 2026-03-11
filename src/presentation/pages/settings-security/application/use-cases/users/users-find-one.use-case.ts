import { inject } from '@angular/core';
import { UsersFindOneFilterDto } from '@pages/settings-security/application/dto/users/users-find-one-filter.dto';
import { UsersFindOneFilterEntity } from '@pages/settings-security/domain/entities/users/users-find-one-filter.entity';
import { UsersFindOneEntity } from '@pages/settings-security/domain/entities/users/users-find-one.entity';
import { UsersFindOneRepository } from '@pages/settings-security/domain/repositories/users/users-find-one-repository';
import { UsersFindOneFilterVo } from '@pages/settings-security/domain/value-objects/users/users-find-one-filter.vo';
import { Observable } from 'rxjs';

export class UsersFindOneUseCase {
    private readonly repository = inject(UsersFindOneRepository);

    execute(filterDto: UsersFindOneFilterDto): Observable<UsersFindOneEntity> {
        const vo = UsersFindOneFilterVo.fromDto(filterDto);
        const filter = UsersFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter);
    }
}
