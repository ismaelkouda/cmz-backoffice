import { Observable } from 'rxjs';
import { SlaAlertChannelOptionEntity, SlaAlertContactEntity } from '@pages/sla/domain/entities/sla/sla-alert-contact.entity';
import { SlaAlertChannelUpdateContract } from '@pages/sla/domain/contracts/sla/sla-alert-channel-update.contract';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

export abstract class SlaAlertChannelRepository {
    abstract readAll(
        search?: string,
        options?: FetchOptions
    ): Observable<SlaAlertContactEntity[]>;
    abstract readChannelOptions(): Observable<SlaAlertChannelOptionEntity[]>;
    abstract update(
        contract: SlaAlertChannelUpdateContract
    ): Observable<MessageResponseDto>;
}
