import { Injectable, inject } from '@angular/core';
import { RadioRelayLinksQuery } from '@pages/coverage-areas/application/queries/radio-relay-links/radio-relay-links.query';
import { RadioRelayLinksHandler } from '@pages/coverage-areas/application/queries-handlers/radio-relay-links/radio-relay-links.handler';
import { RadioRelayLinksEntity } from '@pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksBus {
    private readonly filterHandler = inject(RadioRelayLinksHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RadioRelayLinksEntity>> {
        if (query instanceof RadioRelayLinksQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
