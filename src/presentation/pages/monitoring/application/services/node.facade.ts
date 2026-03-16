import { inject, Injectable } from '@angular/core';
import { NodeBus } from '@pages/monitoring/application/queries-bus/node/node.bus';
import { NodeEntity } from '@pages/monitoring/domain/entities/node/node.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({
    providedIn: 'root',
})
export class NodeFacade extends ObjectBaseFacade<NodeEntity, undefined> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(NodeBus);
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
