import { inject, Injectable } from '@angular/core';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { HistoryFindOneFilterBus } from '@shared/components/history/application/bus/history-find-one-filter.bus';
import { HistoryFindOneFilterCommand } from '@shared/components/history/application/commands/history-find-one-filter.command';
import { HistoryFindOneFilterDto } from '@shared/components/history/application/dto/history-find-one-filter.dto';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class HistoryFindOneFacade extends ObjectBaseFacade<
    HistoryFindOneEntity,
    HistoryFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(HistoryFindOneFilterBus);

    read(filter: HistoryFindOneFilterDto, options: FetchOptions = {}): void {
        const command = new HistoryFindOneFilterCommand(
            filter.uniqId,
            filter.typeModel
        );
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
