import { inject, Injectable } from '@angular/core';
import { RadioRelayLinksFindOneEntity } from '@pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links-find-one.entity';
import { RadioRelayLinksFindOneRepository } from '@pages/coverage-areas/domain/repositories/radio-relay-links/radio-relay-links-find-one.repository';
import { RadioRelayLinksFindOneFilterMapper } from '@pages/coverage-areas/infrastructure/data/mappers/radio-relay-links/radio-relay-links-find-one-filter.mapper';
import { RadioRelayLinksFindOneMapper } from '@pages/coverage-areas/infrastructure/data/mappers/radio-relay-links/radio-relay-links-find-one.mapper';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';
import { RadioRelayLinksFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-find-one-filter.validate-contract';
import { RadioRelayLinksFindOneApi } from '../../sources/radio-relay-links/radio-relay-find-one.api';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksFindOneRepositoryImpl implements RadioRelayLinksFindOneRepository {
    private readonly api = inject(RadioRelayLinksFindOneApi);
    private readonly mapper = inject(RadioRelayLinksFindOneMapper);
    private readonly filterMapper = inject(RadioRelayLinksFindOneFilterMapper);

    execute(
        validContract: RadioRelayLinksFindOneFilterValidateContract,
        options?: FetchOptions
    ): Observable<RadioRelayLinksFindOneEntity> {
        const dto = this.filterMapper.execute(validContract);
        return this.api
            .execute(dto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
