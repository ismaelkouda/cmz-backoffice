import { Injectable, inject } from '@angular/core';
import { RadioRelayLinksFindOneQuery } from '@pages/coverage-areas/application/queries/radio-relay-links/radio-relay-links-find-one.query';
import { RadioRelayLinksFindOneHandler } from '@pages/coverage-areas/application/queries-handlers/radio-relay-links/radio-relay-links-find-one.handler';
import { RadioRelayLinksFindOneEntity } from '@pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksFindOneBus {
    private readonly handler = inject(RadioRelayLinksFindOneHandler);

    dispatch(
        query: RadioRelayLinksFindOneQuery,
        options?: FetchOptions
    ): Observable<RadioRelayLinksFindOneEntity> {
        return this.handler.execute(query, options);
    }
}
