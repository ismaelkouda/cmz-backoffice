import { Injectable, inject } from '@angular/core';
import { SlideQuery } from '@pages/content-management/application/queries/slide/slide.query';
import { SlideHandler } from '@pages/content-management/application/queries-handlers/slide/slide.handler';
import { SlideEntity } from '@pages/content-management/domain/entities/slide/slide.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class SlideBus {
    private readonly filterHandler = inject(SlideHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<SlideEntity>> {
        if (query instanceof SlideQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
