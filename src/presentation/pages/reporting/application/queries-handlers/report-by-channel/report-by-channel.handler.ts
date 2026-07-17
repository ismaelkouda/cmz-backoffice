import { Injectable, inject } from '@angular/core';
import { ReportByChannelUseCase } from '@pages/reporting/application/use-cases/report-by-channel/report-by-channel.use-case';
import { ReportByChannelEntity } from '@pages/reporting/domain/entities/report-by-channel/report-by-channel.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportByChannelHandler {
    private readonly useCase = inject(ReportByChannelUseCase);

    execute(options?: FetchOptions): Observable<ReportByChannelEntity> {
        return this.useCase.execute(options);
    }
}
