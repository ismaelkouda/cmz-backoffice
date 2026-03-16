import { inject, Injectable } from '@angular/core';
import { ResourcesBus } from '@pages/monitoring/application/queries-bus/resources/resources.bus';
import { ResourcesEntity } from '@pages/monitoring/domain/entities/resources/resources.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({
    providedIn: 'root',
})
export class ResourcesFacade extends ObjectBaseFacade<
    ResourcesEntity,
    undefined
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ResourcesBus);
    private readonly STALE_TIME = 2 * 60 * 1000;

    execute(force = false): void {
        const fetch$ = this.bus.dispatch();
        this.fetch(undefined, fetch$, this.ui, this.STALE_TIME, force);
    }

    refresh(): void {
        const fetch$ = this.bus.dispatch();
        this.fetch(undefined, fetch$, this.ui, this.STALE_TIME, true);
    }
}
