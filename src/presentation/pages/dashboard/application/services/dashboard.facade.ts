import { inject, Injectable } from '@angular/core';

import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { DashboardFilterDto } from '@presentation/pages/dashboard/application/dto/dashboard-filter.dto';
import { DashboardQuery } from '@presentation/pages/dashboard/application/queries/dashboard.query';
import { DashboardBus } from '@presentation/pages/dashboard/application/queries-bus/dashboard.bus';
import { DashboardEntity } from '@presentation/pages/dashboard/domain/entities/dashboard.entity';

@Injectable({
    providedIn: 'root',
})
export class DashboardFacade extends ObjectBaseFacade<
    DashboardEntity,
    DashboardFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(DashboardBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    read(
        filter: DashboardFilterDto,
        force = false,
        skipSameFilter = false
    ): void {
        const command = new DashboardQuery(filter.period);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(
            filter,
            fetch$,
            this.ui,
            this.STALE_TIME,
            force,
            skipSameFilter
        );
    }
}
