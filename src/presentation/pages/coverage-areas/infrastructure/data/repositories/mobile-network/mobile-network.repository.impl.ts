import { inject, Injectable } from '@angular/core';
import { MobileNetworkCreateValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-create.validate-contract';
import { MobileNetworkUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-update.validate-contract';
import { MobileNetworkEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network.entity';
import { MobileNetworkRepository } from '@pages/coverage-areas/domain/repositories/mobile-network/mobile-network.repository';
import { mobileNetworkCreateMapper } from '@pages/coverage-areas/infrastructure/data/mappers/mobile-network/mobile-network-create.mapper';
import { mobileNetworkDeleteMapper } from '@pages/coverage-areas/infrastructure/data/mappers/mobile-network/mobile-network-delete.mapper';
import { mobileNetworkDisableMapper } from '@pages/coverage-areas/infrastructure/data/mappers/mobile-network/mobile-network-disable.mapper';
import { mobileNetworkEnableMapper } from '@pages/coverage-areas/infrastructure/data/mappers/mobile-network/mobile-network-enable.mapper';
import { mobileNetworkFilterMapper } from '@pages/coverage-areas/infrastructure/data/mappers/mobile-network/mobile-network-filter.mapper';
import { mobileNetworkUpdateMapper } from '@pages/coverage-areas/infrastructure/data/mappers/mobile-network/mobile-network-update.mapper';
import { MobileNetworkMapper } from '@pages/coverage-areas/infrastructure/data/mappers/mobile-network/mobile-network.mapper';
import { MobileNetworkApi } from '@pages/coverage-areas/infrastructure/data/sources/mobile-network/mobile-network.api';
import {
    Paginate,
    MessageResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';
import { MobileNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-filter.contract';
import { MobileNetworkDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-delete.validate-contract';
import { MobileNetworkEnableValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-enable.validate-contract';
import { MobileNetworkDisableValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-disable.validate-contract';

@Injectable({
    providedIn: 'root',
})
export class MobileNetworkRepositoryImpl implements MobileNetworkRepository {
    private readonly api = inject(MobileNetworkApi);
    private readonly mapper = inject(MobileNetworkMapper);

    readAll(
        validContract: MobileNetworkFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MobileNetworkEntity>> {
        return this.api
            .readAll(mobileNetworkFilterMapper(validContract), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        validContract: MobileNetworkCreateValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.create(mobileNetworkCreateMapper(validContract));
    }

    update(
        validContract: MobileNetworkUpdateValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.update(mobileNetworkUpdateMapper(validContract));
    }

    delete(
        validContract: MobileNetworkDeleteValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.delete(mobileNetworkDeleteMapper(validContract));
    }

    enable(
        validContract: MobileNetworkEnableValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.enable(mobileNetworkEnableMapper(validContract));
    }

    disable(
        validContract: MobileNetworkDisableValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.disable(mobileNetworkDisableMapper(validContract));
    }
}
