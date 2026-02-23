import { inject, Injectable } from '@angular/core';

import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { HistoryFindOneFilterBus } from '@shared/components/history/application/bus/history-find-one-filter.bus';
import { HistoryFindOneFilterCommand } from '@shared/components/history/application/commands/history-find-one-filter.command';
import { HistoryFindOneFilterDto } from '@shared/components/history/application/dto/history-findone-filter.dto';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({
    providedIn: 'root',
})
export class HistoryFindOneFacade extends ObjectBaseFacade<
    HistoryFindOneEntity,
    HistoryFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(HistoryFindOneFilterBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: HistoryFindOneFilterDto, force = false): void {
        const command = new HistoryFindOneFilterCommand(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, force);
    }
}
