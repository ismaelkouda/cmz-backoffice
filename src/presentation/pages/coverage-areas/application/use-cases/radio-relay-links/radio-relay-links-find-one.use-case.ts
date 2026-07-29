import { Injectable, inject } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { RadioRelayLinksFindOneRepository } from '@pages/coverage-areas/domain/repositories/radio-relay-links/radio-relay-links-find-one.repository';
import { RadioRelayLinksFindOneEntity } from '@pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { radioRelayLinksFindOneFilterVo } from '@presentation/pages/coverage-areas/domain/value-objects/radio-relay-links/radio-relay-links-find-one-filter.vo';
import { RadioRelayLinksFindOneFilterContract } from '@presentation/pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-find-one-filter.contract';

@Injectable({
    providedIn: 'root',
})
export class RadioRelayLinksFindOneUseCase {
    private readonly repository = inject(RadioRelayLinksFindOneRepository);

    execute(
        contract: RadioRelayLinksFindOneFilterContract,
        options?: FetchOptions
    ): Observable<RadioRelayLinksFindOneEntity> {
        return defer(() =>
            this.repository.execute(
                radioRelayLinksFindOneFilterVo(contract),
                options
            )
        );
    }
}
