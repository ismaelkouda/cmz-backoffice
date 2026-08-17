import { Injectable, inject } from '@angular/core';
import { AllQuery } from '@pages/requests/application/queries/all/all.query';
import { AllHandler } from '@pages/requests/application/queries-handlers/all/all.handler';
import { AllEntity } from '@pages/requests/domain/entities/all/all.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllBus {
    private readonly filterHandler = inject(AllHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AllEntity>> {
        if (query instanceof AllQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
