import { Injectable, inject } from '@angular/core';
import { AdmissibleQuery } from '@pages/report-states/application/queries/admissible/admissible.query';
import { AdmissibleHandler } from '@pages/report-states/application/queries-handlers/admissible/admissible.handler';
import { AdmissibleEntity } from '@pages/report-states/domain/entities/admissible/admissible.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdmissibleBus {
    private readonly filterHandler = inject(AdmissibleHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AdmissibleEntity>> {
        if (query instanceof AdmissibleQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
