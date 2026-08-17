import { Injectable, inject } from '@angular/core';
import { SlideFindOneQuery } from '@pages/content-management/application/queries/slide/slide-find-one.query';
import { SlideFindOneHandler } from '@pages/content-management/application/queries-handlers/slide/slide-find-one.handler';
import { SlideFindOneEntity } from '@pages/content-management/domain/entities/slide/slide-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class SlideFindOneBus {
    private readonly filterHandler = inject(SlideFindOneHandler);

    dispatch<T>(
        query: T,
        options?: FetchOptions
    ): Observable<SlideFindOneEntity> {
        if (query instanceof SlideFindOneQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
