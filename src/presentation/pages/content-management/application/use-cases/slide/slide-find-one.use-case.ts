import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SlideFindOneFilterDto } from '@presentation/pages/content-management/application/dto/slide/slide-find-one-filter.dto';
import { SlideFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-find-one-filter.entity';
import { SlideFindOneEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-find-one.entity';
import { SlideFindOneRepository } from '@presentation/pages/content-management/domain/repositories/slide/slide-find-one-repository';
import { SlideFindOneFilterVo } from '@presentation/pages/content-management/domain/value-objects/slide/slide-find-one-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class SlideFindOneUseCase {
    private readonly repository = inject(SlideFindOneRepository);

    execute(filterDto: SlideFindOneFilterDto): Observable<SlideFindOneEntity> {
        const vo = SlideFindOneFilterVo.fromDto(filterDto);
        const filter = SlideFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter);
    }
}
