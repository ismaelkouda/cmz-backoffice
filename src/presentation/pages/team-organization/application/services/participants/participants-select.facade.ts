import { inject, Injectable } from '@angular/core';
import { ParticipantsSelectUseCase } from '@pages/team-organization/application/use-cases/participants/participants-select.use-case';
import { ParticipantsSelectEntity } from '@pages/team-organization/domain/entities/participants/participants-select.entity';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';

import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

// import { ParticipantsSelectDto } from '@pages/team-organization/application/dto/participants/participants-select.dto';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsSelectFacade extends ArrayBaseFacade<
    ParticipantsSelectEntity,
    string
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly useCase = inject(ParticipantsSelectUseCase);

    readonly items = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    readAll(options: FetchOptions = {}): void {
        this.fetchWithFilter(
            null,
            this.useCase.readAll.bind(this.useCase, options),
            this.uiFeedback
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
