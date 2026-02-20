import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { DetailsTakeCommand } from '@presentation/pages/processing/application/commands/details/details-take.command';
import { DetailsTreatCommand } from '@presentation/pages/processing/application/commands/details/details-treat.command';
import { DetailsTakeBus } from '@presentation/pages/processing/application/commands-bus/details/details-take.bus';
import { DetailsTreatBus } from '@presentation/pages/processing/application/commands-bus/details/details-treat.bus';
import { DetailsFilterDto } from '@presentation/pages/processing/application/dto/details/details-filter.dto';
import { DetailsTakeDto } from '@presentation/pages/processing/application/dto/details/details-take.dto';
import { DetailsTreatDto } from '@presentation/pages/processing/application/dto/details/details-treat.dto';
import { DetailsQuery } from '@presentation/pages/processing/application/queries/details/details.query';
import { DetailsBus } from '@presentation/pages/processing/application/queries-bus/details/details.bus';
import { QueuesFacade } from '@presentation/pages/processing/application/services/queues/queues.facade';
import { TasksFacade } from '@presentation/pages/processing/application/services/tasks/tasks.facade';
import { DetailsEntity } from '@presentation/pages/processing/domain/entities/details/details.entity';

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
    private readonly bus = inject(DetailsBus);
    private readonly treatBus = inject(DetailsTreatBus);
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

    read(filter: DetailsFilterDto, force = false): void {
        const command = new DetailsQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, force);
    }

    take(item: DetailsTakeDto): void {
        this._actionLoading.set(true);

        const command = new DetailsTakeCommand(item.uniqId);
        console.log('command take: ', command);

        this.handleActionWithRefresh(
            this.takeBus.dispatch(command),
            'COMMON.SUCCESS.TAKE',
            () => this.queuesFacade.refreshWithLastFilterAndPage()
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

    treat(team: DetailsTreatDto): void {
        this._actionLoading.set(true);

        const command = new DetailsTreatCommand(team.uniqId, team.comment);

        this.handleActionWithRefresh(
            this.treatBus.dispatch(command),
            'COMMON.SUCCESS.TREAT',
            () => this.tasksFacade.refreshWithLastFilterAndPage()
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
}
