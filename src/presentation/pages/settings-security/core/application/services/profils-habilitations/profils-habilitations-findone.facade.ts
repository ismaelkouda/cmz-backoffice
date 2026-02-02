import { inject, Injectable } from '@angular/core';

import { shouldFetch } from '@shared/application/base/facade.utils';
import { ObjectBaseFacade } from '@shared/application/base/object-base-facade';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';

import { ProfilsHabilitationsFindOneFilterDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-findone-filter.dto';
import { ProfilsHabilitationsFindOneUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profils-habilitations/profils-habilitations-findone.use-case';
import { ProfilsHabilitationsFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-findone.entity';

@Injectable({
    providedIn: 'root',
})
export class ProfilsHabilitationsFindOneFacade extends ObjectBaseFacade<
    ProfilsHabilitationsFindOneEntity,
    ProfilsHabilitationsFindOneFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(ProfilsHabilitationsFindOneUseCase);

    readonly item$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    read(
        filter: ProfilsHabilitationsFindOneFilterDto,
        forceRefresh = false
    ): void {
        const hasData = this.itemsSubject.getValue() !== null;
        if (
            !shouldFetch(
                forceRefresh,
                hasData,
                this.lastFetchTimestamp,
                this.STALE_TIME
            )
        ) {
            return;
        }
        this.fetchWithFilter(
            filter,
            this.useCase.read.bind(this.useCase),
            this.uiFeedbackService
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
