import { defer, Observable } from 'rxjs';
import { RadioRelayLinksRepository } from '@pages/coverage-areas/domain/repositories/radio-relay-links/radio-relay-links.repository';
import { RadioRelayLinksCreateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-create.contract';
import { RadioRelayLinksUpdateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-update.contract';
import { RadioRelayLinksDeleteContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-delete.contract';
import { RadioRelayLinksEnableContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-enable.contract';
import { RadioRelayLinksDisableContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-disable.contract';
import { RadioRelayLinksFilterContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-filter.contract';
import {
    Paginate,
    MessageResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { RadioRelayLinksEntity } from '@pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links.entity';
import { radioRelayLinksCreateVo } from '@pages/coverage-areas/domain/value-objects/radio-relay-links/radio-relay-links-create.vo';
import { radioRelayLinksUpdateVo } from '@pages/coverage-areas/domain/value-objects/radio-relay-links/radio-relay-links-update.vo';
import { radioRelayLinksDeleteVo } from '@pages/coverage-areas/domain/value-objects/radio-relay-links/radio-relay-links-delete.vo';
import { radioRelayLinksEnableVo } from '@pages/coverage-areas/domain/value-objects/radio-relay-links/radio-relay-links-enable.vo';
import { radioRelayLinksDisableVo } from '@pages/coverage-areas/domain/value-objects/radio-relay-links/radio-relay-links-disable.vo';
import { radioRelayLinksFilterVo } from '@pages/coverage-areas/domain/value-objects/radio-relay-links/radio-relay-links-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { RadioRelayLinksFilterEntity } from '@presentation/pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links-filter.entity';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class RadioRelayLinksUseCase {
    constructor(private readonly repository: RadioRelayLinksRepository) {}

    execute(
        contract: RadioRelayLinksFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RadioRelayLinksEntity>> {
        return defer(() => {
            const vo = radioRelayLinksFilterVo(contract);
            const entity = RadioRelayLinksFilterEntity(vo);
            return this.repository.readAll(entity, page, options);
        });
    }

    create(
        contract: RadioRelayLinksCreateContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.create(radioRelayLinksCreateVo(contract))
        );
    }

    update(
        contract: RadioRelayLinksUpdateContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.update(radioRelayLinksUpdateVo(contract))
        );
    }

    delete(
        contract: RadioRelayLinksDeleteContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.delete(radioRelayLinksDeleteVo(contract))
        );
    }

    enable(
        contract: RadioRelayLinksEnableContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.enable(radioRelayLinksEnableVo(contract))
        );
    }

    disable(
        contract: RadioRelayLinksDisableContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.disable(radioRelayLinksDisableVo(contract))
        );
    }
}
