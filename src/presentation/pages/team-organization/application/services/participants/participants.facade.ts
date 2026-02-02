import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseFacade } from '@shared/application/base/base-facade';
import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';

import { ParticipantsCreateDto } from '@presentation/pages/team-organization/application/dtos/participants/participants-create.dto';
import { ParticipantsFilterDto } from '@presentation/pages/team-organization/application/dtos/participants/participants-filter.dto';
import { ParticipantsUpdateDto } from '@presentation/pages/team-organization/application/dtos/participants/participants-update.dto';
import { ParticipantsUseCase } from '@presentation/pages/team-organization/application/use-cases/participants/participants.use-case';
import { ParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants.entity';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsFacade extends BaseFacade<
    ParticipantsEntity,
    ParticipantsFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(ParticipantsUseCase);

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
        filter: ParticipantsFilterDto | null = {},
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

    refreshWithLastFilterAndPage(): void {
        const currentFilter = this.filterSubject.getValue();
        const currentPage = this.pageSubject.getValue();
        this.fetchWithFilterAndPage(
            currentFilter,
            currentPage,
            this.useCase.readAll.bind(this.useCase),
            this.uiFeedbackService
        );
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);
        const firstPage = PAGINATION_CONST.DEFAULT_PAGE;
        this.pageSubject.next(firstPage);
        this.fetchWithFilterAndPage(
            null,
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

    create(user: ParticipantsCreateDto): Observable<any> {
        return this.handleActionWithRefresh(
            this.useCase.create(user),
            'COMMON.SUCCESS.CREATE'
        );
    }

    update(user: ParticipantsUpdateDto): Observable<any> {
        return this.handleActionWithRefresh(
            this.useCase.update(user),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    delete(id: string): Observable<any> {
        return this.handleActionWithRefresh(
            this.useCase.delete(id),
            'COMMON.SUCCESS.DELETE'
        );
    }

    enable(id: string) {
        return this.handleActionWithRefresh(
            this.useCase.enable(id),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    disable(id: string) {
        return this.handleActionWithRefresh(
            this.useCase.disable(id),
            'COMMON.SUCCESS.UPDATE'
        );
    }
}
