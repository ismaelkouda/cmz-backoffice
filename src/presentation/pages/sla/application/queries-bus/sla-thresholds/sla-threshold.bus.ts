import { Injectable, inject } from '@angular/core';
import {
    SlaChannelOptionsQuery,
    SlaThresholdQuery,
} from '@pages/sla/application/queries/sla-thresholds/sla-threshold.query';
import { SlaThresholdHandler } from '@pages/sla/application/queries-handlers/sla-thresholds/sla-threshold.handler';
import { SlaChannelOptionEntity } from '@pages/sla/domain/entities/sla/sla-channel-option.entity';
import { SlaThresholdEntity } from '@pages/sla/domain/entities/sla/sla-threshold.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlaThresholdBus {
    private readonly handler = inject(SlaThresholdHandler);

    dispatch(
        query: SlaThresholdQuery,
        options?: FetchOptions
    ): Observable<SlaThresholdEntity[]>;
    dispatch(
        query: SlaChannelOptionsQuery,
        options?: FetchOptions
    ): Observable<SlaChannelOptionEntity[]>;
    dispatch(
        query: SlaThresholdQuery | SlaChannelOptionsQuery,
        options?: FetchOptions
    ): Observable<SlaThresholdEntity[] | SlaChannelOptionEntity[]> {
        if (query instanceof SlaThresholdQuery) {
            return this.handler.execute(query, options);
        }
        if (query instanceof SlaChannelOptionsQuery) {
            return this.handler.executeChannelOptions(query);
        }
        throw new Error('No handler found for query');
    }
}
