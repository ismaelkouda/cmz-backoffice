import { Injectable } from '@angular/core';
import { SlideQuery } from '@pages/content-management/application/queries/slide/slide.query';
import { SlideHandler } from '@pages/content-management/application/queries-handlers/slide/slide.handler';
import { SlideEntity } from '@pages/content-management/domain/entities/slide/slide.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideBus {
    constructor(private readonly filterHandler: SlideHandler) {}

    dispatch<T>(query: T, page: string): Observable<Paginate<SlideEntity>> {
        if (query instanceof SlideQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
