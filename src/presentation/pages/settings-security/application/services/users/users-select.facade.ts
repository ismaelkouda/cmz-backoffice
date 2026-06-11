import { inject, Injectable } from '@angular/core';
import { UsersSelectUseCase } from '@pages/settings-security/application/use-cases/users/users-select.use-case';
import { UsersSelectEntity } from '@pages/settings-security/domain/entities/users/users-select.entity';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';

import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class UsersSelectFacade extends ArrayBaseFacade<
    UsersSelectEntity,
    void
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly useCase = inject(UsersSelectUseCase);

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
