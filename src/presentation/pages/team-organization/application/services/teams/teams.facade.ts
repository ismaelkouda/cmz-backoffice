import { inject, Injectable, signal } from '@angular/core';
import { TeamsCreateCommand } from '@pages/team-organization/application/commands/teams/teams-create.command';
import { TeamsDeleteCommand } from '@pages/team-organization/application/commands/teams/teams-delete.command';
import { TeamsDisableCommand } from '@pages/team-organization/application/commands/teams/teams-disable.command';
import { TeamsEnableCommand } from '@pages/team-organization/application/commands/teams/teams-enable.command';
import { TeamsUpdateCommand } from '@pages/team-organization/application/commands/teams/teams-update.command';
import { TeamsCreateBus } from '@pages/team-organization/application/commands-bus/teams/teams-create.bus';
import { TeamsDeleteBus } from '@pages/team-organization/application/commands-bus/teams/teams-delete.bus';
import { TeamsDisableBus } from '@pages/team-organization/application/commands-bus/teams/teams-disable.bus';
import { TeamsEnableBus } from '@pages/team-organization/application/commands-bus/teams/teams-enable.bus';
import { TeamsUpdateBus } from '@pages/team-organization/application/commands-bus/teams/teams-update.bus';
import { TeamsCreateDto } from '@pages/team-organization/application/dto/teams/teams-create.dto';
import { TeamsDeleteDto } from '@pages/team-organization/application/dto/teams/teams-delete.dto';
import { TeamsDisableDto } from '@pages/team-organization/application/dto/teams/teams-disable.dto';
import { TeamsEnableDto } from '@pages/team-organization/application/dto/teams/teams-enable.dto';
import { TeamsFilterDto } from '@pages/team-organization/application/dto/teams/teams-filter.dto';
import { TeamsUpdateDto } from '@pages/team-organization/application/dto/teams/teams-update.dto';
import { TeamsQuery } from '@pages/team-organization/application/queries/teams/teams.query';
import { TeamsBus } from '@pages/team-organization/application/queries-bus/teams/teams.bus';
import { TeamsEntity } from '@pages/team-organization/domain/entities/teams/teams.entity';
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
export class TeamsFacade extends BaseFacade<TeamsEntity, TeamsFilterDto> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(TeamsBus);
    private readonly createBus = inject(TeamsCreateBus);
    private readonly updateBus = inject(TeamsUpdateBus);
    private readonly enableBus = inject(TeamsEnableBus);
    private readonly disableBus = inject(TeamsDisableBus);
    private readonly deleteBus = inject(TeamsDeleteBus);

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
            () => this.refreshWithLastFilterAndPage()
        );
    }

    readAll(
        filter: TeamsFilterDto = {},
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

        const command = new TeamsQuery(
            filter?.search,
            filter?.member,
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
        const command = new TeamsQuery(
            filter?.search,
            filter?.member,
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
        const command = new TeamsQuery(
            filter?.search,
            filter?.member,
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
        const command = new TeamsQuery(
            filter?.search,
            filter?.member,
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

    create(team: TeamsCreateDto): void {
        this._actionState.set('loading');

        const command = new TeamsCreateCommand(
            team.code,
            team.name,
            team.description,
            team.reportTypes,
            team.operators,
            team.permissions
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

    update(team: TeamsUpdateDto): void {
        this._actionState.set('loading');

        const command = new TeamsUpdateCommand(
            team.uniqId,
            team.code,
            team.name,
            team.description,
            team.reportTypes,
            team.operators,
            team.permissions
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

    enable(team: TeamsEnableDto): void {
        const command = new TeamsEnableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    disable(team: TeamsDisableDto): void {
        const command = new TeamsDisableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    delete(team: TeamsDeleteDto): void {
        const command = new TeamsDeleteCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
