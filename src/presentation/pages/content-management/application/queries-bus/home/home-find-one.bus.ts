import { Injectable } from '@angular/core';
import { HomeFindOneQuery } from '@pages/content-management/application/queries/home/home-find-one.query';
import { HomeFindOneHandler } from '@pages/content-management/application/queries-handlers/home/home-find-one.handler';
import { HomeFindOneEntity } from '@pages/content-management/domain/entities/home/home-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeFindOneBus {
    constructor(private readonly filterHandler: HomeFindOneHandler) {}

    dispatch<T>(query: T): Observable<HomeFindOneEntity> {
        if (query instanceof HomeFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
