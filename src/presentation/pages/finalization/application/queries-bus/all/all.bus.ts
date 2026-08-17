import { Injectable, inject } from '@angular/core';
import { AllQuery } from '@pages/finalization/application/queries/all/all.query';
import { AllHandler } from '@pages/finalization/application/queries-handlers/all/all.handler';
import { AllEntity } from '@pages/finalization/domain/entities/all/all.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

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
