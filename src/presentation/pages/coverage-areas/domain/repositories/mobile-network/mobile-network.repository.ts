import { Injectable } from '@angular/core';
import { MobileNetworkCreateValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-create.validate-contract';
import { MobileNetworkDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-delete.validate-contract';
import { MobileNetworkDisableValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-disable.validate-contract';
import { MobileNetworkEnableValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-enable.validate-contract';
import { MobileNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-filter.contract';
import { MobileNetworkUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-update.validate-contract';
import { MobileNetworkEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network.entity';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class MobileNetworkRepository {
    abstract readAll(
        dto: MobileNetworkFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MobileNetworkEntity>>;
    abstract create(
        contract: MobileNetworkCreateValidateContract
    ): Observable<MessageResponseDto>;
    abstract update(
        contract: MobileNetworkUpdateValidateContract
    ): Observable<MessageResponseDto>;
    abstract delete(
        dto: MobileNetworkDeleteValidateContract
    ): Observable<MessageResponseDto>;
    abstract enable(
        dto: MobileNetworkEnableValidateContract
    ): Observable<MessageResponseDto>;
    abstract disable(
        dto: MobileNetworkDisableValidateContract
    ): Observable<MessageResponseDto>;
}
