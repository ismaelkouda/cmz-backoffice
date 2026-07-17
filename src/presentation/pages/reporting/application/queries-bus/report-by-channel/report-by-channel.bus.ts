import { Injectable, inject } from '@angular/core';
import { ReportByChannelHandler } from '@pages/reporting/application/queries-handlers/report-by-channel/report-by-channel.handler';
import { ReportByChannelEntity } from '@pages/reporting/domain/entities/report-by-channel/report-by-channel.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportByChannelBus {
    private readonly filterHandler = inject(ReportByChannelHandler);

    dispatch(options?: FetchOptions): Observable<ReportByChannelEntity> {
        return this.filterHandler.execute(options);
    }
}
