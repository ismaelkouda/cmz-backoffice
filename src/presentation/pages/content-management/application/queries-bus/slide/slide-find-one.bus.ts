import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SlideFindOneQuery } from '@presentation/pages/content-management/application/queries/slide/slide-find-one.query';
import { SlideFindOneHandler } from '@presentation/pages/content-management/application/queries-handlers/slide/slide-find-one.handler';
import { SlideFindOneEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-find-one.entity';

@Injectable({ providedIn: 'root' })
export class SlideFindOneBus {
    constructor(private readonly filterHandler: SlideFindOneHandler) {}

    dispatch<T>(query: T): Observable<SlideFindOneEntity> {
        if (query instanceof SlideFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
