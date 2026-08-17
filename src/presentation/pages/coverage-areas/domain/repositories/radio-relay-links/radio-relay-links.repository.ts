import { Observable } from 'rxjs';
import {
    Paginate,
    MessageResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { RadioRelayLinksEntity } from '@pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links.entity';
import { RadioRelayLinksFilterContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-filter.contract';
import { RadioRelayLinksCreateValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-create.validate-contract';
import { RadioRelayLinksUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-update.validate-contract';
import { RadioRelayLinksDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-delete.validate-contract';
import { RadioRelayLinksEnableValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-enable.validate-contract';
import { RadioRelayLinksDisableValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-disable.validate-contract';
import { RadioRelayLinksFindOneEntity } from '@pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links-find-one.entity';
import { RadioRelayLinksFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-find-one-filter.validate-contract';

export abstract class RadioRelayLinksRepository {
    abstract readAll(
        filter: RadioRelayLinksFilterContract,
        page: string,
        options?: any
    ): Observable<Paginate<RadioRelayLinksEntity>>;
    abstract create(
        contract: RadioRelayLinksCreateValidateContract
    ): Observable<MessageResponseDto>;
    abstract update(
        contract: RadioRelayLinksUpdateValidateContract
    ): Observable<MessageResponseDto>;
    abstract delete(
        contract: RadioRelayLinksDeleteValidateContract
    ): Observable<MessageResponseDto>;
    abstract enable(
        contract: RadioRelayLinksEnableValidateContract
    ): Observable<MessageResponseDto>;
    abstract disable(
        contract: RadioRelayLinksDisableValidateContract
    ): Observable<MessageResponseDto>;
}

export abstract class RadioRelayLinksFindOneRepository {
    abstract execute(
        filter: RadioRelayLinksFindOneFilterValidateContract,
        options?: any
    ): Observable<RadioRelayLinksFindOneEntity>;
}
