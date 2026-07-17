import { slideQueryMapper } from '@pages/content-management/application/queries-mappers/slide/slide.mapper';
import { Injectable, inject } from '@angular/core';
import { SlideQuery } from '@pages/content-management/application/queries/slide/slide.query';
import { SlideUseCase } from '@pages/content-management/application/use-cases/slide/slide.use-case';
import { SlideEntity } from '@pages/content-management/domain/entities/slide/slide.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideHandler {
    private readonly useCase = inject(SlideUseCase);

    execute(
        command: SlideQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<SlideEntity>> {
        return this.useCase.execute(slideQueryMapper(command), page, options);
    }
}
