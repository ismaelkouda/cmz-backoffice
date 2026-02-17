import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/services/facade.utils';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { DetailsApproveCommand } from '@presentation/pages/requests/application/commands/details/details-approve.command';
import { DetailsRejectCommand } from '@presentation/pages/requests/application/commands/details/details-reject.command';
import { DetailsApproveBus } from '@presentation/pages/requests/application/commands-bus/details/details-approve.bus';
import { DetailsRejectBus } from '@presentation/pages/requests/application/commands-bus/details/details-reject.bus';
import { DetailsApproveDto } from '@presentation/pages/requests/application/dto/details/details-approve.dto';
import { DetailsFilterDto } from '@presentation/pages/requests/application/dto/details/details-filter.dto';
import { DetailsRejectDto } from '@presentation/pages/requests/application/dto/details/details-reject.dto';
import { DetailsTakeDto } from '@presentation/pages/requests/application/dto/details/details-take.dto';
import { DetailsQuery } from '@presentation/pages/requests/application/queries/details/details.query';
import { DetailsBus } from '@presentation/pages/requests/application/queries-bus/details/details.bus';
import { QueuesFacade } from '@presentation/pages/requests/application/services/queues/queues.facade';
import { TasksFacade } from '@presentation/pages/requests/application/services/tasks/tasks.facade';
import { DetailsEntity } from '@presentation/pages/requests/domain/entities/details/details.entity';

@Injectable({
    providedIn: 'root',
})
export class DetailsFacade extends ObjectBaseFacade<
    DetailsEntity,
    DetailsFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly queuesFacade = inject(QueuesFacade);
    private readonly tasksFacade = inject(TasksFacade);
    private readonly bus = inject(DetailsBus);
    private readonly approveBus = inject(DetailsApproveBus);
    private readonly takeBus = inject(DetailsApproveBus);
    private readonly rejectBus = inject(DetailsRejectBus);

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
        successKey: string,
        refresh?: () => void
    ): Observable<T> {
        return handleObservableWithFeedback(
            observable,
            this.uiFeedbackService,
            successKey,
            refresh
        );
    }

    read(filter: DetailsFilterDto, forceRefresh = false): void {
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
        const command = new DetailsQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetchWithFilter(filter, fetch$, this.uiFeedbackService);

        this.hasInitialized = true;
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

    take(item: DetailsTakeDto): void {
        this._actionState.set('loading');

        const command = new DetailsQuery(item.uniqId);

        this.handleActionWithRefresh(
            this.takeBus.dispatch(command),
            'COMMON.SUCCESS.CREATE',
            this.queuesFacade.refreshWithLastFilterAndPage
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

    approve(team: DetailsApproveDto): void {
        this._actionState.set('loading');

        const command = new DetailsApproveCommand(team.uniqId, team.comment);

        this.handleActionWithRefresh(
            this.approveBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE',
            this.tasksFacade.refreshWithLastFilterAndPage
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

    reject(team: DetailsRejectDto): void {
        this._actionState.set('loading');

        const command = new DetailsRejectCommand(
            team.uniqId,
            team.comment,
            team.reason
        );

        this.handleActionWithRefresh(
            this.rejectBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE',
            this.tasksFacade.refreshWithLastFilterAndPage
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
