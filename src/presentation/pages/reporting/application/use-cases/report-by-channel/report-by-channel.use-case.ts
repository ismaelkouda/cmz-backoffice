import { Injectable, inject } from '@angular/core';
import { ReportByChannelEntity } from '@pages/reporting/domain/entities/report-by-channel/report-by-channel.entity';
import { ReportByChannelRepository } from '@pages/reporting/domain/repositories/report-by-channel-repository.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReportByChannelUseCase {
    private readonly repository = inject(ReportByChannelRepository);

    execute(options?: FetchOptions): Observable<ReportByChannelEntity> {
        return this.repository.getReportByChannel(options);
    }
}
