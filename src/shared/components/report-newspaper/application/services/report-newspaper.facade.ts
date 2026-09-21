import { inject, Injectable, signal } from '@angular/core';
import { ReportNewspaperFilterDto } from '@shared/components/report-newspaper/application/dto/report-newspaper-filter.dto';
import { ReportNewspaperFilterQuery } from '@shared/components/report-newspaper/application/queries/report-newspaper-filter.query';
import { ReportNewspaperFilterBus } from '@shared/components/report-newspaper/application/queries-bus/report-newspaper-filter.bus';
import { ReportNewspaperEntity } from '@shared/components/report-newspaper/domain/entities/report-newspaper.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ReportNewspaperFacade extends ObjectBaseFacade<
    ReportNewspaperEntity[],
    ReportNewspaperFilterDto | null
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ReportNewspaperFilterBus);

    private readonly _actionLoading = signal(false);
    readonly actionLoading = this._actionLoading.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    read(filter: ReportNewspaperFilterDto, options: FetchOptions = {}): void {
        const command = new ReportNewspaperFilterQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }

    resetActionState(): void {
        this._actionSuccess.set(0);
        this._actionError.set(null);
        this._actionLoading.set(false);
    }
}
