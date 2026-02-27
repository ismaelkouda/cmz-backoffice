import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { HomeQuery } from '@presentation/pages/content-management/application/queries/home/home.query';
import { HomeHandler } from '@presentation/pages/content-management/application/queries-handlers/home/home.handler';
import { HomeEntity } from '@presentation/pages/content-management/domain/entities/home/home.entity';

@Injectable({ providedIn: 'root' })
export class HomeBus {
    constructor(private readonly filterHandler: HomeHandler) {}

    dispatch<T>(query: T, page: string): Observable<Paginate<HomeEntity>> {
        if (query instanceof HomeQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
