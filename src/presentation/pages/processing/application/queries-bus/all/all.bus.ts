import { Injectable } from '@angular/core';
import { AllQuery } from '@pages/processing/application/queries/all/all.query';
import { AllHandler } from '@pages/processing/application/queries-handlers/all/all.handler';
import { AllEntity } from '@pages/processing/domain/entities/all/all.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllBus {
    constructor(private readonly filterHandler: AllHandler) {}

    dispatch<T>(query: T, page: string): Observable<Paginate<AllEntity>> {
        if (query instanceof AllQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
