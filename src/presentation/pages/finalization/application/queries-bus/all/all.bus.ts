import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AllQuery } from '@presentation/pages/finalization/application/queries/all/all.query';
import { AllHandler } from '@presentation/pages/finalization/application/queries-handlers/all/all.handler';
import { AllEntity } from '@presentation/pages/finalization/domain/entities/all/all.entity';

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
