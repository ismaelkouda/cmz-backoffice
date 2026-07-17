import { ReportByChannelEntity } from '@pages/reporting/domain/entities/report-by-channel/report-by-channel.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ReportByChannelRepository {
    abstract getReportByChannel(
        options?: FetchOptions
    ): Observable<ReportByChannelEntity>;
}
