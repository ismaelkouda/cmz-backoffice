import { inject, Injectable } from '@angular/core';
import { RadioRelayLinksCreateValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-create.validate-contract';
import { RadioRelayLinksUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-update.validate-contract';
import { RadioRelayLinksDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-delete.validate-contract';
import { RadioRelayLinksEnableValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-enable.validate-contract';
import { RadioRelayLinksDisableValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-disable.validate-contract';
import { RadioRelayLinksEntity } from '@pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links.entity';
import { RadioRelayLinksRepository } from '@pages/coverage-areas/domain/repositories/radio-relay-links/radio-relay-links.repository';
import { RadioRelayLinksCreateMapper } from '@pages/coverage-areas/infrastructure/data/mappers/radio-relay-links/radio-relay-links-create.mapper';
import { RadioRelayLinksDeleteMapper } from '@pages/coverage-areas/infrastructure/data/mappers/radio-relay-links/radio-relay-links-delete.mapper';
import { RadioRelayLinksDisableMapper } from '@pages/coverage-areas/infrastructure/data/mappers/radio-relay-links/radio-relay-links-disable.mapper';
import { RadioRelayLinksEnableMapper } from '@pages/coverage-areas/infrastructure/data/mappers/radio-relay-links/radio-relay-links-enable.mapper';
import { RadioRelayLinksFilterMapper } from '@pages/coverage-areas/infrastructure/data/mappers/radio-relay-links/radio-relay-links-filter.mapper';
import { RadioRelayLinksUpdateMapper } from '@pages/coverage-areas/infrastructure/data/mappers/radio-relay-links/radio-relay-links-update.mapper';
import { RadioRelayLinksMapper } from '@pages/coverage-areas/infrastructure/data/mappers/radio-relay-links/radio-relay-links.mapper';
import { RadioRelayLinksApi } from '@pages/coverage-areas/infrastructure/data/sources/radio-relay-links/radio-relay-links.api';
import {
    Paginate,
    MessageResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';
import { RadioRelayLinksFilterContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-filter.contract';

@Injectable({
    providedIn: 'root',
})
export class RadioRelayLinksRepositoryImpl implements RadioRelayLinksRepository {
    private readonly api = inject(RadioRelayLinksApi);
    private readonly mapper = inject(RadioRelayLinksMapper);
    private readonly createMapper = inject(RadioRelayLinksCreateMapper);
    private readonly updateMapper = inject(RadioRelayLinksUpdateMapper);
    private readonly deleteMapper = inject(RadioRelayLinksDeleteMapper);
    private readonly enableMapper = inject(RadioRelayLinksEnableMapper);
    private readonly disableMapper = inject(RadioRelayLinksDisableMapper);
    private readonly filterMapper = inject(RadioRelayLinksFilterMapper);

    readAll(
        validContract: RadioRelayLinksFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RadioRelayLinksEntity>> {
        return this.api
            .readAll(this.filterMapper.execute(validContract), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        validContract: RadioRelayLinksCreateValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.create(this.createMapper.execute(validContract));
    }

    update(
        validContract: RadioRelayLinksUpdateValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.update(this.updateMapper.execute(validContract));
    }

    delete(
        validContract: RadioRelayLinksDeleteValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.delete(this.deleteMapper.execute(validContract));
    }

    enable(
        validContract: RadioRelayLinksEnableValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.enable(this.enableMapper.execute(validContract));
    }

    disable(
        validContract: RadioRelayLinksDisableValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.disable(this.disableMapper.execute(validContract));
    }
}
