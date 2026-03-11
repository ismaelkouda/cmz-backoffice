import { inject, Injectable, signal } from '@angular/core';
import { TeamsParticipantsAssignCommand } from '@pages/team-organization/application/commands/teams/teams-participants-assign.command';
import { TeamsParticipantsReassignCommand } from '@pages/team-organization/application/commands/teams/teams-participants-reassign.command';
import { TeamsParticipantsRemoveCommand } from '@pages/team-organization/application/commands/teams/teams-participants-remove.command';
import { TeamsParticipantsAssignBus } from '@pages/team-organization/application/commands-bus/teams/teams-participants-assign.bus';
import { TeamsParticipantsReassignBus } from '@pages/team-organization/application/commands-bus/teams/teams-participants-reassign.bus';
import { TeamsParticipantsRemoveBus } from '@pages/team-organization/application/commands-bus/teams/teams-participants-remove.bus';
import { TeamsParticipantsAssignDto } from '@pages/team-organization/application/dto/teams/teams-participants-assign.dto';
import { TeamsParticipantsFilterDto } from '@pages/team-organization/application/dto/teams/teams-participants-filter.dto';
import { TeamsParticipantsReassignDto } from '@pages/team-organization/application/dto/teams/teams-participants-reassign.dto';
import { TeamsParticipantsRemoveDto } from '@pages/team-organization/application/dto/teams/teams-participants-remove.dto';
import { TeamsParticipantsQuery } from '@pages/team-organization/application/queries/teams/teams-participants.query';
import { TeamsParticipantsBus } from '@pages/team-organization/application/queries-bus/teams/teams-participants.bus';
import { TeamsParticipantsEntity } from '@pages/team-organization/domain/entities/teams/teams-participants.entity';
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
export class TeamsParticipantsFacade extends BaseFacade<
    TeamsParticipantsEntity,
    TeamsParticipantsFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(TeamsParticipantsBus);
    private readonly reassignBus = inject(TeamsParticipantsReassignBus);
    private readonly assignBus = inject(TeamsParticipantsAssignBus);
    private readonly removeBus = inject(TeamsParticipantsRemoveBus);

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
            () => {
                console.log(
                    'this.filterSubject.getValue()?.uniqId: ',
                    this.filterSubject.getValue()?.uniqId
                );
                this.refresh();
            }
        );
    }

    readAll(
        filter: TeamsParticipantsFilterDto,
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

        const command = new TeamsParticipantsQuery(
            filter.uniqId,
            filter?.search
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
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new TeamsParticipantsQuery(
            filter?.uniqId ?? '',
            filter?.search
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

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        const command = new TeamsParticipantsQuery(
            filter?.uniqId ?? '',
            filter?.search
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

    reassign(dto: TeamsParticipantsReassignDto): void {
        console.log('dto: ', dto);
        this._actionState.set('loading');
        const command = new TeamsParticipantsReassignCommand(
            dto.uniqId,
            dto.participants
        );
        this.handleActionWithRefresh(
            this.reassignBus.dispatch(command),
            'COMMON.SUCCESS.REASSIGN'
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

    assign(dto: TeamsParticipantsAssignDto): void {
        this._actionState.set('loading');
        const command = new TeamsParticipantsAssignCommand(
            dto.uniqId,
            dto.participants
        );
        this.handleActionWithRefresh(
            this.assignBus.dispatch(command),
            'COMMON.SUCCESS.ASSIGN'
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

    remove(dto: TeamsParticipantsRemoveDto): void {
        this._actionState.set('loading');
        const command = new TeamsParticipantsRemoveCommand(
            dto.uniqId,
            dto.participants
        );
        this.handleActionWithRefresh(
            this.removeBus.dispatch(command),
            'COMMON.SUCCESS.REMOVE'
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
}
