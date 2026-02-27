import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HomeFindOneFilterDto } from '@presentation/pages/content-management/application/dto/home/home-find-one-filter.dto';
import { HomeFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/home/home-find-one-filter.entity';
import { HomeFindOneEntity } from '@presentation/pages/content-management/domain/entities/home/home-find-one.entity';
import { HomeFindOneRepository } from '@presentation/pages/content-management/domain/repositories/home/home-find-one-repository';
import { HomeFindOneFilterVo } from '@presentation/pages/content-management/domain/value-objects/home/home-find-one-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class HomeFindOneUseCase {
    private readonly repository = inject(HomeFindOneRepository);

    execute(filterDto: HomeFindOneFilterDto): Observable<HomeFindOneEntity> {
        const vo = HomeFindOneFilterVo.fromDto(filterDto);
        const filter = HomeFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter);
    }
}
