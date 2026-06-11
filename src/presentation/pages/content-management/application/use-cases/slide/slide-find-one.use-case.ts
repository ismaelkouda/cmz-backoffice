import { inject, Injectable } from '@angular/core';
import { SlideFindOneFilterDto } from '@pages/content-management/application/dto/slide/slide-find-one-filter.dto';
import { SlideFindOneFilterEntity } from '@pages/content-management/domain/entities/slide/slide-find-one-filter.entity';
import { SlideFindOneEntity } from '@pages/content-management/domain/entities/slide/slide-find-one.entity';
import { SlideFindOneRepository } from '@pages/content-management/domain/repositories/slide/slide-find-one-repository';
import { SlideFindOneFilterVo } from '@pages/content-management/domain/value-objects/slide/slide-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SlideFindOneUseCase {
    private readonly repository = inject(SlideFindOneRepository);

    execute(
        filterDto: SlideFindOneFilterDto,
        options?: FetchOptions
    ): Observable<SlideFindOneEntity> {
        const vo = SlideFindOneFilterVo.fromDto(filterDto);
        const filter = SlideFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter, options);
    }
}
