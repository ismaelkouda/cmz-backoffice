import { Injectable, inject } from '@angular/core';
import { HomeFindOneQuery } from '@pages/content-management/application/queries/home/home-find-one.query';
import { HomeFindOneHandler } from '@pages/content-management/application/queries-handlers/home/home-find-one.handler';
import { HomeFindOneEntity } from '@pages/content-management/domain/entities/home/home-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class HomeFindOneBus {
    private readonly filterHandler = inject(HomeFindOneHandler);

    dispatch<T>(
        query: T,
        options?: FetchOptions
    ): Observable<HomeFindOneEntity> {
        if (query instanceof HomeFindOneQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
