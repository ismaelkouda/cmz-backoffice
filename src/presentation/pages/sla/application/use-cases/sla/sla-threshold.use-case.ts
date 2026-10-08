import { inject, Injectable } from '@angular/core';
import { SlaThresholdFilterContract } from '@pages/sla/domain/contracts/sla/sla-threshold-filter.contract';
import { SlaThresholdUpdateContract } from '@pages/sla/domain/contracts/sla/sla-threshold-update.contract';
import { SlaChannelOptionEntity } from '@pages/sla/domain/entities/sla/sla-channel-option.entity';
import { SlaThresholdEntity } from '@pages/sla/domain/entities/sla/sla-threshold.entity';
import { SlaThresholdRepository } from '@pages/sla/domain/repositories/sla/sla-threshold.repository';
import { slaThresholdFilterVo } from '@pages/sla/domain/value-objects/sla/sla-threshold-filter.vo';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlaThresholdUseCase {
    private readonly repository = inject(SlaThresholdRepository);

    execute(
        filter: SlaThresholdFilterContract,
        options?: FetchOptions
    ): Observable<SlaThresholdEntity[]> {
        return this.repository.readAll(slaThresholdFilterVo(filter), options);
    }

    channelOptions(): Observable<SlaChannelOptionEntity[]> {
        return this.repository.readChannelOptions();
    }

    update(
        contract: SlaThresholdUpdateContract
    ): Observable<MessageResponseDto> {
        return this.repository.update(contract);
    }
}
