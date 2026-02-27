import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NewsFindOneFilterDto } from '@presentation/pages/content-management/application/dto/news/news-find-one-filter.dto';
import { NewsFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/news/news-find-one-filter.entity';
import { NewsFindOneEntity } from '@presentation/pages/content-management/domain/entities/news/news-find-one.entity';
import { NewsFindOneRepository } from '@presentation/pages/content-management/domain/repositories/news/news-find-one-repository';
import { NewsFindOneFilterVo } from '@presentation/pages/content-management/domain/value-objects/news/news-find-one-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class NewsFindOneUseCase {
    private readonly repository = inject(NewsFindOneRepository);

    execute(filterDto: NewsFindOneFilterDto): Observable<NewsFindOneEntity> {
        const vo = NewsFindOneFilterVo.fromDto(filterDto);
        const filter = NewsFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter);
    }
}
