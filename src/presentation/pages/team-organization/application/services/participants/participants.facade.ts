import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

import { BaseFacade } from '@shared/application/base/base-facade';
import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';

import { ParticipantsCreateBus } from '@presentation/pages/team-organization/application/bus/participants/participants-create.bus';
import { ParticipantsUpdateBus } from '@presentation/pages/team-organization/application/bus/participants/participants-update.bus';
import { ParticipantsCreateCommand } from '@presentation/pages/team-organization/application/commands/participants/participants-create.command';
import { ParticipantsUpdateCommand } from '@presentation/pages/team-organization/application/commands/participants/participants-update.command';
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
    private readonly participantsCreateBus = inject(ParticipantsCreateBus);
    private readonly participantsUpdateBus = inject(ParticipantsUpdateBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

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

    create(participant: ParticipantsCreateDto): void {
        this._actionState.set('loading');

        const command = new ParticipantsCreateCommand(
            participant.firstName,
            participant.lastName,
            participant.email,
            participant.phone,
            participant.role
        );

        this.handleActionWithRefresh(
            this.participantsCreateBus.dispatch(command),
            'COMMON.SUCCESS.CREATE'
        )
            .pipe(
                tap(() => {
                    this._actionSuccess.update((v) => v + 1);
                }),
                catchError((err) => {
                    this._actionError.set(err);
                    return throwError(() => err);
                }),
                finalize(() => this._actionState.set('idle'))
            )
            .subscribe();
    }

    update(participant: ParticipantsUpdateDto): void {
        this._actionState.set('loading');
        const command = new ParticipantsUpdateCommand(
            participant.uniqId,
            participant.firstName,
            participant.lastName,
            participant.email,
            participant.phone,
            participant.role
        );
        this.handleActionWithRefresh(
            this.participantsUpdateBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        )
            .pipe(
                tap(() => {
                    this._actionSuccess.update((v) => v + 1);
                }),
                catchError((err) => {
                    this._actionError.set(err);
                    return throwError(() => err);
                }),
                finalize(() => this._actionState.set('idle'))
            )
            .subscribe();
    }

    delete(id: string): Observable<any> {
        return this.handleActionWithRefresh(
            this.useCase.delete(id),
            'COMMON.SUCCESS.DELETE'
        );
    }

    enable(id: string): Observable<any> {
        return this.handleActionWithRefresh(
            this.useCase.enable(id),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    disable(id: string): Observable<any> {
        return this.handleActionWithRefresh(
            this.useCase.disable(id),
            'COMMON.SUCCESS.UPDATE'
        );
    }
}
