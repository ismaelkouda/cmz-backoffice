import { Injectable, inject } from '@angular/core';
import { ReportByChannelEntity } from '@pages/reporting/domain/entities/report-by-channel/report-by-channel.entity';
import { ReportByChannelRepository } from '@pages/reporting/domain/repositories/report-by-channel-repository.interface';
import { ReportByChannelMapper } from '@pages/reporting/infrastructure/data/mappers/report-by-channel.mapper';
import { ReportByChannelApi } from '@pages/reporting/infrastructure/data/sources/report-by-channel.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportByChannelRepositoryImpl
    implements ReportByChannelRepository
{
    private readonly api = inject(ReportByChannelApi);
    private readonly reportByChannelMapper = inject(ReportByChannelMapper);

    getReportByChannel(
        options?: FetchOptions
    ): Observable<ReportByChannelEntity> {
        return this.api
            .getReportByChannel(options)
            .pipe(
                map((response) =>
                    this.reportByChannelMapper.mapFromDto(response)
                )
            );
    }
}
