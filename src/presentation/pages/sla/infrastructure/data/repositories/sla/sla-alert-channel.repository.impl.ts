import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SlaAlertChannelUpdateContract } from '@pages/sla/domain/contracts/sla/sla-alert-channel-update.contract';
import {
    SlaAlertChannelOptionEntity,
    SlaAlertContactEntity,
} from '@pages/sla/domain/entities/sla/sla-alert-contact.entity';
import { SlaAlertChannelRepository } from '@pages/sla/domain/repositories/sla/sla-alert-channel.repository';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { SlaAlertChannelMapper } from '@pages/sla/infrastructure/data/mappers/sla/sla-alert-channel.mapper';
import { SlaAlertChannelApi } from '@pages/sla/infrastructure/data/sources/sla/sla-alert-channel.api';

@Injectable({ providedIn: 'root' })
export class SlaAlertChannelRepositoryImpl
    implements SlaAlertChannelRepository
{
    private readonly api = inject(SlaAlertChannelApi);
    private readonly mapper = inject(SlaAlertChannelMapper);

    readAll(
        search?: string,
        options?: FetchOptions
    ): Observable<SlaAlertContactEntity[]> {
        return this.api
            .readAll(search, options)
            .pipe(map((response) => response.data.map((item) => this.mapper.map(item))));
    }

    readChannelOptions(): Observable<SlaAlertChannelOptionEntity[]> {
        return this.api
            .readChannelOptions()
            .pipe(map((response) => response.data.map((item) => this.mapper.mapOption(item))));
    }

    update(
        contract: SlaAlertChannelUpdateContract
    ): Observable<MessageResponseDto> {
        return this.api.update(this.mapper.mapUpdate(contract));
    }
}
