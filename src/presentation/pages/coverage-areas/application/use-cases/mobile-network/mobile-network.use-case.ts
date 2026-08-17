import { inject, Injectable } from '@angular/core';
import { MobileNetworkEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network.entity';
import { MobileNetworkCreateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-create.contract';
import { MobileNetworkUpdateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-update.contract';
import { MobileNetworkRepository } from '@pages/coverage-areas/domain/repositories/mobile-network/mobile-network.repository';
import { mobileNetworkCreateVo } from '@pages/coverage-areas/domain/value-objects/mobile-network/mobile-network-create.vo';
import { mobileNetworkDeleteVo } from '@pages/coverage-areas/domain/value-objects/mobile-network/mobile-network-delete.vo';
import { mobileNetworkDisableVo } from '@pages/coverage-areas/domain/value-objects/mobile-network/mobile-network-disable.vo';
import { mobileNetworkEnableVo } from '@pages/coverage-areas/domain/value-objects/mobile-network/mobile-network-enable.vo';
import { mobileNetworkFilterVo } from '@pages/coverage-areas/domain/value-objects/mobile-network/mobile-network-filter.vo';
import { mobileNetworkUpdateVo } from '@pages/coverage-areas/domain/value-objects/mobile-network/mobile-network-update.vo';
import { MobileNetworkFilterContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-filter.contract';
import {
    Paginate,
    MessageResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';
import { MobileNetworkDeleteContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-delete.contract';
import { MobileNetworkEnableContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-enable.contract';
import { MobileNetworkDisableContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-disable.contract';
import { mobileNetworkFilterEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network-filter.entity';

@Injectable({
    providedIn: 'root',
})
export class MobileNetworkUseCase {
    private readonly repository = inject(MobileNetworkRepository);

    execute(
        contract: MobileNetworkFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MobileNetworkEntity>> {
        return defer(() => {
            const vo = mobileNetworkFilterVo(contract);
            const entity = mobileNetworkFilterEntity(vo);
            return this.repository.readAll(entity, page, options);
        });
    }

    create(
        contract: MobileNetworkCreateContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.create(mobileNetworkCreateVo(contract))
        );
    }

    update(
        contract: MobileNetworkUpdateContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.update(mobileNetworkUpdateVo(contract))
        );
    }

    delete(
        contract: MobileNetworkDeleteContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.delete(mobileNetworkDeleteVo(contract))
        );
    }

    enable(
        contract: MobileNetworkEnableContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.enable(mobileNetworkEnableVo(contract))
        );
    }

    disable(
        contract: MobileNetworkDisableContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.disable(mobileNetworkDisableVo(contract))
        );
    }
}
