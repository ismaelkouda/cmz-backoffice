import { Injectable } from '@angular/core';
import { OpticalFiberNetworkCreateValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-create.validate-contract';
import { OpticalFiberNetworkDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-delete.validate-contract';
import { OpticalFiberNetworkDisableValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-disable.validate-contract';
import { OpticalFiberNetworkEnableValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-enable.validate-contract';
import { OpticalFiberNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-filter.contract';
import { OpticalFiberNetworkUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-update.validate-contract';
import { OpticalFiberNetworkEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network.entity';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class OpticalFiberNetworkRepository {
    abstract readAll(
        dto: OpticalFiberNetworkFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<OpticalFiberNetworkEntity>>;
    abstract create(
        contract: OpticalFiberNetworkCreateValidateContract
    ): Observable<MessageResponseDto>;
    abstract update(
        contract: OpticalFiberNetworkUpdateValidateContract
    ): Observable<MessageResponseDto>;
    abstract delete(
        dto: OpticalFiberNetworkDeleteValidateContract
    ): Observable<MessageResponseDto>;
    abstract enable(
        dto: OpticalFiberNetworkEnableValidateContract
    ): Observable<MessageResponseDto>;
    abstract disable(
        dto: OpticalFiberNetworkDisableValidateContract
    ): Observable<MessageResponseDto>;
}
