import { inject, Injectable } from '@angular/core';
import { ReportByEquipmentsBus } from '@pages/reporting/application/queries-bus/report-by-equipments/report-by-equipments.bus';
import { ReportByEquipmentsEntity } from '@pages/reporting/domain/entities/report-by-equipments/report-by-equipments.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ReportByEquipmentsFacade extends ObjectBaseFacade<
    ReportByEquipmentsEntity,
    undefined
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ReportByEquipmentsBus);

    execute(options?: FetchOptions): void {
        const fetch$ = this.bus.dispatch(options);
        this.fetch(undefined, fetch$, this.ui);
    }

    refresh(): void {
        const fetch$ = this.bus.dispatch({
            forceRefresh: true,
        });
        this.fetch(undefined, fetch$, this.ui);
    }
}
