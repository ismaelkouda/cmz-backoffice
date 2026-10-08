import { SlaThresholdFilterContract } from '@pages/sla/domain/contracts/sla/sla-threshold-filter.contract';
import { SlaThresholdUpdateContract } from '@pages/sla/domain/contracts/sla/sla-threshold-update.contract';
import { SlaChannelOptionEntity } from '@pages/sla/domain/entities/sla/sla-channel-option.entity';
import { SlaThresholdFilterEntity } from '@pages/sla/domain/entities/sla/sla-threshold-filter.entity';
import { SlaThresholdEntity } from '@pages/sla/domain/entities/sla/sla-threshold.entity';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class SlaThresholdRepository {
    abstract readAll(
        filter: SlaThresholdFilterEntity,
        options?: FetchOptions
    ): Observable<SlaThresholdEntity[]>;

    abstract readChannelOptions(): Observable<SlaChannelOptionEntity[]>;

    abstract update(
        contract: SlaThresholdUpdateContract
    ): Observable<MessageResponseDto>;
}
