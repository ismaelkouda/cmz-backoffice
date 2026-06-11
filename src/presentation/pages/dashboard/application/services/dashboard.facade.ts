import { inject, Injectable } from '@angular/core';
import { DashboardFilterDto } from '@pages/dashboard/application/dto/dashboard-filter.dto';
import { DashboardQuery } from '@pages/dashboard/application/queries/dashboard.query';
import { DashboardBus } from '@pages/dashboard/application/queries-bus/dashboard.bus';
import { DashboardEntity } from '@pages/dashboard/domain/entities/dashboard.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class DashboardFacade extends ObjectBaseFacade<
    DashboardEntity,
    DashboardFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(DashboardBus);

    read(filter: DashboardFilterDto, options: FetchOptions = {}): void {
        console.log('filter: ', filter);
        const command = new DashboardQuery(filter.period);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
