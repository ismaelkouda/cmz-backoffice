import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseFacade } from '@shared/application/base/base-facade';
import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';

import { ProfilsHabilitationsUsersFilterDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-users-filter.dto';
import { ProfilsHabilitationsUsersReassignDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-users-reassign.dto';
import { ProfilsHabilitationsUsersRemoveDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-users-remove.dto';
import { ProfilsHabilitationsUsersUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profils-habilitations/profils-habilitations-users.use-case';
import { ProfilsHabilitationsUsersEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-users.entity';

@Injectable({
    providedIn: 'root',
})
export class ProfilsHabilitationsUsersFacade extends BaseFacade<
    ProfilsHabilitationsUsersEntity,
    ProfilsHabilitationsUsersFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(ProfilsHabilitationsUsersUseCase);

    readonly item$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(
        observable: Observable<T>,
        successKey: string
    ): Observable<T> {
        return handleObservableWithFeedback(
            observable,
            this.uiFeedbackService,
            successKey,
            () => this.refresh()
        );
    }

    readAll(
        filter: ProfilsHabilitationsUsersFilterDto,
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        forceRefresh = false
    ): void {
        const hasData = this.itemsSubject.getValue().length > 0;
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

        this.fetchWithFilterAndPage(
            filter,
            page,
            this.useCase.readAll.bind(this.useCase),
            this.uiFeedbackService
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        const uniqId = this.filterSubject.getValue()?.uniqId ?? '';
        const firstPage = PAGINATION_CONST.DEFAULT_PAGE;
        this.fetchWithFilterAndPage(
            { uniqId },
            firstPage,
            this.useCase.readAll.bind(this.useCase),
            this.uiFeedbackService
        );
        this.lastFetchTimestamp = Date.now();
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        this.fetchWithFilterAndPage(
            currentFilter,
            String(pageNumber),
            this.useCase.readAll.bind(this.useCase),
            this.uiFeedbackService
        );
        this.lastFetchTimestamp = Date.now();
    }

    resetMemory(): void {
        this.hasInitialized = false;
        this.lastFetchTimestamp = 0;
        this.reset();
    }

    getMemoryStatus(): {
        hasInitialized: boolean;
        lastFetch: number;
        hasData: boolean;
    } {
        return {
            hasInitialized: this.hasInitialized,
            lastFetch: this.lastFetchTimestamp,
            hasData: this.itemsSubject.getValue() !== null,
        };
    }

    reassign(dto: ProfilsHabilitationsUsersReassignDto) {
        return this.handleActionWithRefresh(
            this.useCase.reassign(dto),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    remove(dto: ProfilsHabilitationsUsersRemoveDto) {
        return this.handleActionWithRefresh(
            this.useCase.remove(dto),
            'COMMON.SUCCESS.UPDATE'
        );
    }
}
