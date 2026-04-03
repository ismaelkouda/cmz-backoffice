import { inject, Injectable, signal } from '@angular/core';
import { DetailsFinalizeCommand } from '@pages/finalization/application/commands/details/details-finalize.command';
import { DetailsTakeCommand } from '@pages/finalization/application/commands/details/details-take.command';
import { DetailsFinalizeBus } from '@pages/finalization/application/commands-bus/details/details-finalize.bus';
import { DetailsTakeBus } from '@pages/finalization/application/commands-bus/details/details-take.bus';
import { DetailsFilterDto } from '@pages/finalization/application/dto/details/details-filter.dto';
import { DetailsFinalizeDto } from '@pages/finalization/application/dto/details/details-finalize.dto';
import { DetailsTakeDto } from '@pages/finalization/application/dto/details/details-take.dto';
import { DetailsQuery } from '@pages/finalization/application/queries/details/details.query';
import { DetailsBus } from '@pages/finalization/application/queries-bus/details/details.bus';
import { AllFacade } from '@pages/finalization/application/services/all/all.facade';
import { QueuesFacade } from '@pages/finalization/application/services/queues/queues.facade';
import { TasksFacade } from '@pages/finalization/application/services/tasks/tasks.facade';
import { DetailsEntity } from '@pages/finalization/domain/entities/details/details.entity';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DetailsFacade extends ObjectBaseFacade<
    DetailsEntity,
    DetailsFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly queuesFacade = inject(QueuesFacade);
    private readonly tasksFacade = inject(TasksFacade);
    private readonly allFacade = inject(AllFacade);
    private readonly bus = inject(DetailsBus);
    private readonly finalizeBus = inject(DetailsFinalizeBus);
    private readonly takeBus = inject(DetailsTakeBus);

    private readonly _actionLoading = signal(false);
    readonly actionLoading = this._actionLoading.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(
        observable: Observable<T>,
        successKey: string,
        refresh?: () => void
    ): Observable<T> {
        return handleObservableWithFeedback(
            observable,
            this.ui,
            successKey,
            refresh
        );
    }

    read(filter: DetailsFilterDto): void {
        const command = new DetailsQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, true, true);
    }

    take(item: DetailsTakeDto): void {
        this._actionLoading.set(true);

        const command = new DetailsTakeCommand(item.uniqId);

        this.handleActionWithRefresh(
            this.takeBus.dispatch(command),
            'COMMON.SUCCESS.TAKE',
            () => {
                this.queuesFacade.refreshWithLastFilterAndPage();
                this.tasksFacade.refreshWithLastFilterAndPage();
            }
        )
            .pipe(
                tap(() => {
                    this._actionSuccess.update((v) => v + 1);
                }),
                catchError((err) => {
                    this._actionError.set(err);
                    return throwError(() => err);
                }),
                finalize(() => this._actionLoading.set(false))
            )
            .subscribe();
    }

    finalize(team: DetailsFinalizeDto): void {
        this._actionLoading.set(true);

        const command = new DetailsFinalizeCommand(team.uniqId, team.comment);

        this.handleActionWithRefresh(
            this.finalizeBus.dispatch(command),
            'COMMON.SUCCESS.FINALIZE',
            () => {
                this.tasksFacade.refreshWithLastFilterAndPage();
                this.allFacade.refreshWithLastFilterAndPage();
            }
        )
            .pipe(
                tap(() => {
                    this._actionSuccess.update((v) => v + 1);
                }),
                catchError((err) => {
                    this._actionError.set(err);
                    return throwError(() => err);
                }),
                finalize(() => this._actionLoading.set(false))
            )
            .subscribe();
    }

    resetActionState(): void {
        this._actionSuccess.set(0);
        this._actionError.set(null);
        this._actionLoading.set(false);
    }
}
