import { Injectable, inject } from '@angular/core';
import { SlaQuery } from '@pages/sla/application/queries/sla/sla.query';
import { SlaHandler } from '@pages/sla/application/queries-handlers/sla/sla.handler';
import { SlaEntity } from '@pages/sla/domain/entities/sla/sla.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlaBus {
    private readonly filterHandler = inject(SlaHandler);

    dispatch<T>(query: T, options?: FetchOptions): Observable<SlaEntity[]> {
        if (query instanceof SlaQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
