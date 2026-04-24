import { inject, Injectable, signal } from '@angular/core';
import { ParticipantsCreateCommand } from '@pages/team-organization/application/commands/participants/participants-create.command';
import { ParticipantsDeleteCommand } from '@pages/team-organization/application/commands/participants/participants-delete.command';
import { ParticipantsDisableCommand } from '@pages/team-organization/application/commands/participants/participants-disable.command';
import { ParticipantsEnableCommand } from '@pages/team-organization/application/commands/participants/participants-enable.command';
import { ParticipantsUpdateCommand } from '@pages/team-organization/application/commands/participants/participants-update.command';
import { ParticipantsCreateBus } from '@pages/team-organization/application/commands-bus/participants/participants-create.bus';
import { ParticipantsDeleteBus } from '@pages/team-organization/application/commands-bus/participants/participants-delete.bus';
import { ParticipantsDisableBus } from '@pages/team-organization/application/commands-bus/participants/participants-disable.bus';
import { ParticipantsEnableBus } from '@pages/team-organization/application/commands-bus/participants/participants-enable.bus';
import { ParticipantsUpdateBus } from '@pages/team-organization/application/commands-bus/participants/participants-update.bus';
import { ParticipantsCreateDto } from '@pages/team-organization/application/dto/participants/participants-create.dto';
import { ParticipantsDeleteDto } from '@pages/team-organization/application/dto/participants/participants-delete.dto';
import { ParticipantsDisableDto } from '@pages/team-organization/application/dto/participants/participants-disable.dto';
import { ParticipantsEnableDto } from '@pages/team-organization/application/dto/participants/participants-enable.dto';
import { ParticipantsFilterDto } from '@pages/team-organization/application/dto/participants/participants-filter.dto';
import { ParticipantsUpdateDto } from '@pages/team-organization/application/dto/participants/participants-update.dto';
import { ParticipantsQuery } from '@pages/team-organization/application/queries/participants/participants.query';
import { ParticipantsBus } from '@pages/team-organization/application/queries-bus/participants/participants.bus';
import { ParticipantsEntity } from '@pages/team-organization/domain/entities/participants/participants.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsFacade extends BaseFacade<
    ParticipantsEntity,
    ParticipantsFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(ParticipantsBus);
    private readonly createBus = inject(ParticipantsCreateBus);
    private readonly updateBus = inject(ParticipantsUpdateBus);
    private readonly enableBus = inject(ParticipantsEnableBus);
    private readonly disableBus = inject(ParticipantsDisableBus);
    private readonly deleteBus = inject(ParticipantsDeleteBus);

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
        filter: ParticipantsFilterDto = {},
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

        const command = new ParticipantsQuery(
            filter?.search,
            filter?.role,
            filter?.isActive
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(
            filter,
            page,
            fetch$,
            this.uiFeedbackService
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new ParticipantsQuery(
            filter?.search,
            filter?.role,
            filter?.isActive
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(null, page, fetch$, this.uiFeedbackService);
        this.lastFetchTimestamp = Date.now();
    }

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        const command = new ParticipantsQuery(
            filter?.search,
            filter?.role,
            filter?.isActive
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(
            filter,
            page,
            fetch$,
            this.uiFeedbackService
        );
        this.lastFetchTimestamp = Date.now();
    }

    refreshWithLastFilterAndPage(): void {
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new ParticipantsQuery(
            filter?.search,
            filter?.role,
            filter?.isActive
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(
            filter,
            page,
            fetch$,
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
            participant.phone
            // participant.role
        );

        this.handleActionWithRefresh(
            this.createBus.dispatch(command),
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
            participant.phone
            // participant.role
        );
        this.handleActionWithRefresh(
            this.updateBus.dispatch(command),
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

    enable(team: ParticipantsEnableDto): void {
        const command = new ParticipantsEnableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    disable(team: ParticipantsDisableDto): void {
        const command = new ParticipantsDisableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    delete(team: ParticipantsDeleteDto): void {
        const command = new ParticipantsDeleteCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
