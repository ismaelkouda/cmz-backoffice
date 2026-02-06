import { inject, Injectable, signal } from '@angular/core';
import { finalize, Observable } from 'rxjs';

import { BaseFacade } from '@shared/application/base/base-facade';
import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';

import { TeamsParticipantsAssignBus } from '@presentation/pages/team-organization/application/bus/teams/teams-participants-assign.bus';
import { TeamsParticipantsReassignBus } from '@presentation/pages/team-organization/application/bus/teams/teams-participants-reassign.bus';
import { TeamsParticipantsRemoveBus } from '@presentation/pages/team-organization/application/bus/teams/teams-participants-remove.bus';
import { TeamsParticipantsAssignCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-participants-assign.command';
import { TeamsParticipantsReassignCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-participants-reassign.command';
import { TeamsParticipantsRemoveCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-participants-remove.command';
import { TeamsParticipantsFilterDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-participants-filter.dto';
import { TeamsParticipantsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams-participants.use-case';
import { TeamsParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants.entity';

@Injectable({
    providedIn: 'root',
})
export class TeamsParticipantsFacade extends BaseFacade<
    TeamsParticipantsEntity,
    TeamsParticipantsFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(TeamsParticipantsUseCase);
    private readonly teamsParticipantsReassignBus = inject(
        TeamsParticipantsReassignBus
    );
    private readonly teamsParticipantsAssignBus = inject(
        TeamsParticipantsAssignBus
    );
    private readonly teamsParticipantsRemoveBus = inject(
        TeamsParticipantsRemoveBus
    );

    private readonly _actionState = signal<
        'idle' | 'loading' | 'success' | 'error'
    >('idle');
    readonly actionState = this._actionState.asReadonly();

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

    reassign(uniqId: string, participants: TeamsParticipantsEntity[]) {
        this._actionState.set('loading');
        const command = new TeamsParticipantsReassignCommand(
            uniqId,
            participants.map((p) => p.uniqId)
        );
        return this.handleActionWithRefresh(
            this.teamsParticipantsReassignBus.dispatch(command),
            'COMMON.SUCCESS.REASSIGN'
        )
            .pipe(
                finalize(() => {
                    if (this._actionState() === 'loading') {
                        this._actionState.set('idle');
                    }
                })
            )
            .subscribe({
                next: () => this._actionState.set('success'),
                error: () => this._actionState.set('error'),
            });
    }

    assign(uniqId: string, ...participants: string[]) {
        this._actionState.set('loading');
        const command = new TeamsParticipantsAssignCommand(
            uniqId,
            participants
        );
        return this.handleActionWithRefresh(
            this.teamsParticipantsAssignBus.dispatch(command),
            'COMMON.SUCCESS.ASSIGN'
        )
            .pipe(
                finalize(() => {
                    if (this._actionState() === 'loading') {
                        this._actionState.set('idle');
                    }
                })
            )
            .subscribe({
                next: () => this._actionState.set('success'),
                error: () => this._actionState.set('error'),
            });
    }

    remove(uniqId: string, participants: TeamsParticipantsEntity[]) {
        this._actionState.set('loading');
        const command = new TeamsParticipantsRemoveCommand(
            uniqId,
            participants.map((p) => p.uniqId)
        );
        return this.handleActionWithRefresh(
            this.teamsParticipantsRemoveBus.dispatch(command),
            'COMMON.SUCCESS.REMOVE'
        )
            .pipe(
                finalize(() => {
                    if (this._actionState() === 'loading') {
                        this._actionState.set('idle');
                    }
                })
            )
            .subscribe({
                next: () => this._actionState.set('success'),
                error: () => this._actionState.set('error'),
            });
    }
}
