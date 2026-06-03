import { inject, Injectable } from '@angular/core';
import { MapBus } from '@pages/interactive-map/application/queries-bus/map/map.bus';
import { MapEntity } from '@presentation/pages/interactive-map/domain/entities/map/map.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({
    providedIn: 'root',
})
export class MapFacade extends ObjectBaseFacade<MapEntity, undefined> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(MapBus);
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
