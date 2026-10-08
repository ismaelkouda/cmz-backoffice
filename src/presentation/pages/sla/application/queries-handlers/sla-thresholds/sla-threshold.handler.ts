import { inject, Injectable } from '@angular/core';
import {
    SlaChannelOptionsQuery,
    SlaThresholdQuery,
} from '@pages/sla/application/queries/sla-thresholds/sla-threshold.query';
import { SlaThresholdUseCase } from '@pages/sla/application/use-cases/sla/sla-threshold.use-case';
import { SlaChannelOptionEntity } from '@pages/sla/domain/entities/sla/sla-channel-option.entity';
import { SlaThresholdEntity } from '@pages/sla/domain/entities/sla/sla-threshold.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { slaThresholdQueryMapper } from '@pages/sla/application/queries/mappers/sla-threshold.query.mapper';

@Injectable({ providedIn: 'root' })
export class SlaThresholdHandler {
    private readonly useCase = inject(SlaThresholdUseCase);

    execute(
        query: SlaThresholdQuery,
        options?: FetchOptions
    ): Observable<SlaThresholdEntity[]> {
        return this.useCase.execute(slaThresholdQueryMapper(query), options);
    }

    executeChannelOptions(
        query: SlaChannelOptionsQuery
    ): Observable<SlaChannelOptionEntity[]> {
        void query;
        return this.useCase.channelOptions();
    }
}
