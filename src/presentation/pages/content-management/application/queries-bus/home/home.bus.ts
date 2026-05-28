import { Injectable, inject } from '@angular/core';
import { HomeQuery } from '@pages/content-management/application/queries/home/home.query';
import { HomeHandler } from '@pages/content-management/application/queries-handlers/home/home.handler';
import { HomeEntity } from '@pages/content-management/domain/entities/home/home.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeBus {
    private readonly filterHandler = inject(HomeHandler);

    dispatch<T>(query: T, page: string): Observable<Paginate<HomeEntity>> {
        if (query instanceof HomeQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
