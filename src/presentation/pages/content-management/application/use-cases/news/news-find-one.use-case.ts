import { inject, Injectable } from '@angular/core';
import { NewsFindOneFilterDto } from '@pages/content-management/application/dto/news/news-find-one-filter.dto';
import { NewsFindOneFilterEntity } from '@pages/content-management/domain/entities/news/news-find-one-filter.entity';
import { NewsFindOneEntity } from '@pages/content-management/domain/entities/news/news-find-one.entity';
import { NewsFindOneRepository } from '@pages/content-management/domain/repositories/news/news-find-one-repository';
import { NewsFindOneFilterVo } from '@pages/content-management/domain/value-objects/news/news-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NewsFindOneUseCase {
    private readonly repository = inject(NewsFindOneRepository);

    execute(
        filterDto: NewsFindOneFilterDto,
        options?: FetchOptions
    ): Observable<NewsFindOneEntity> {
        const vo = NewsFindOneFilterVo.fromDto(filterDto);
        const filter = NewsFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter, options);
    }
}
