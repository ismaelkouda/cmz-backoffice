import { inject, Injectable } from '@angular/core';
import { SlaThresholdUpdateContract } from '@pages/sla/domain/contracts/sla/sla-threshold-update.contract';
import { SlaChannelOptionEntity } from '@pages/sla/domain/entities/sla/sla-channel-option.entity';
import { SlaThresholdEntity } from '@pages/sla/domain/entities/sla/sla-threshold.entity';
import { SlaThresholdFilterEntity } from '@pages/sla/domain/entities/sla/sla-threshold-filter.entity';
import { SlaThresholdRepository } from '@pages/sla/domain/repositories/sla/sla-threshold.repository';
import { SlaThresholdMapper } from '@pages/sla/infrastructure/data/mappers/sla/sla-threshold.mapper';
import { SlaThresholdsApi } from '@pages/sla/infrastructure/data/sources/sla/sla-thresholds.api';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlaThresholdRepositoryImpl implements SlaThresholdRepository {
    private readonly api = inject(SlaThresholdsApi);
    private readonly mapper = inject(SlaThresholdMapper);

    readAll(
        filter: SlaThresholdFilterEntity,
        options?: FetchOptions
    ): Observable<SlaThresholdEntity[]> {
        return this.api
            .reportTypes(filter.slaType, filter.channel, options)
            .pipe(
                map((response) =>
                    response.data.map((item) => this.mapper.mapItem(item))
                )
            );
    }

    readChannelOptions(): Observable<SlaChannelOptionEntity[]> {
        return this.api
            .channelOptions()
            .pipe(
                map((response) =>
                    response.data.map((item) =>
                        this.mapper.mapChannelOption(item)
                    )
                )
            );
    }

    update(
        contract: SlaThresholdUpdateContract
    ): Observable<MessageResponseDto> {
        return this.api.updateReportSla(this.mapper.mapUpdate(contract));
    }
}
