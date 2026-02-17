import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/services/facade.utils';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { DetailsFinalizeCommand } from '@presentation/pages/finalization/application/commands/details/details-finalize.command';
import { DetailsFinalizeBus } from '@presentation/pages/finalization/application/commands-bus/details/details-finalize.bus';
import { DetailsFilterDto } from '@presentation/pages/finalization/application/dto/details/details-filter.dto';
import { DetailsFinalizeDto } from '@presentation/pages/finalization/application/dto/details/details-finalize.dto';
import { DetailsTakeDto } from '@presentation/pages/finalization/application/dto/details/details-take.dto';
import { DetailsQuery } from '@presentation/pages/finalization/application/queries/details/details.query';
import { DetailsBus } from '@presentation/pages/finalization/application/queries-bus/details/details.bus';
import { QueuesFacade } from '@presentation/pages/finalization/application/services/queues/queues.facade';
import { TasksFacade } from '@presentation/pages/finalization/application/services/tasks/tasks.facade';
import { DetailsEntity } from '@presentation/pages/finalization/domain/entities/details/details.entity';

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
    private readonly finalizeBus = inject(DetailsFinalizeBus);
    private readonly takeBus = inject(DetailsFinalizeBus);

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

    finalize(team: DetailsFinalizeDto): void {
        this._actionState.set('loading');

        const command = new DetailsFinalizeCommand(team.uniqId, team.comment);

        this.handleActionWithRefresh(
            this.finalizeBus.dispatch(command),
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
