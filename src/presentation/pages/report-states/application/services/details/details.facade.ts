import { inject, Injectable, signal } from '@angular/core';
import { DetailsApproveCommand } from '@pages/report-states/application/commands/details/details-approve.command';
import { DetailsRejectCommand } from '@pages/report-states/application/commands/details/details-reject.command';
import { DetailsTakeCommand } from '@pages/report-states/application/commands/details/details-take.command';
import { DetailsApproveBus } from '@pages/report-states/application/commands-bus/details/details-approve.bus';
import { DetailsRejectBus } from '@pages/report-states/application/commands-bus/details/details-reject.bus';
import { DetailsTakeBus } from '@pages/report-states/application/commands-bus/details/details-take.bus';
import { DetailsApproveDto } from '@pages/report-states/application/dto/details/details-approve.dto';
import { DetailsFilterDto } from '@pages/report-states/application/dto/details/details-filter.dto';
import { DetailsRejectDto } from '@pages/report-states/application/dto/details/details-reject.dto';
import { DetailsTakeDto } from '@pages/report-states/application/dto/details/details-take.dto';
import { DetailsQuery } from '@pages/report-states/application/queries/details/details.query';
import { DetailsBus } from '@pages/report-states/application/queries-bus/details/details.bus';
import { CloseFacade } from '@pages/report-states/application/services/close/close.facade';
import { EvaluateFacade } from '@pages/report-states/application/services/evaluate/evaluate.facade';
import { RejectFacade } from '@pages/report-states/application/services/reject/reject.facade';
import { DetailsEntity } from '@pages/report-states/domain/entities/details/details.entity';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class DetailsFacade extends ObjectBaseFacade<
    DetailsEntity,
    DetailsFilterDto | null
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly evaluateFacade = inject(EvaluateFacade);
    private readonly closeFacade = inject(CloseFacade);
    private readonly rejectFacade = inject(RejectFacade);
    private readonly bus = inject(DetailsBus);
    private readonly approveBus = inject(DetailsApproveBus);
    private readonly takeBus = inject(DetailsTakeBus);
    private readonly rejectBus = inject(DetailsRejectBus);

    private readonly _actionLoading = signal(false);
    readonly actionLoading = this._actionLoading.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

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

    read(filter: DetailsFilterDto, options: FetchOptions = {}): void {
        const command = new DetailsQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }

    take(item: DetailsTakeDto): void {
        this._actionLoading.set(true);

        const command = new DetailsTakeCommand(item.uniqId);

        this.handleActionWithRefresh(
            this.takeBus.dispatch(command),
            'COMMON.SUCCESS.TAKE',
            () => {
                this.evaluateFacade.refreshWithLastFilterAndPage();
                this.closeFacade.refreshWithLastFilterAndPage();
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

    approve(detail: DetailsApproveDto): void {
        this._actionLoading.set(true);

        const command = new DetailsApproveCommand(
            detail.uniqId,
            detail.comment,
            detail.approvalType,
            detail.callbackType,
            detail.coordinates,
            detail.locationName,
            detail.reportType,
            detail.operators,
            detail.description,
            detail.decision,
            detail.placeDescription,
            detail.reason,
            detail.placePhoto
        );

        this.handleActionWithRefresh(
            this.approveBus.dispatch(command),
            'COMMON.SUCCESS.APPROVE',
            () => {
                this.closeFacade.refreshWithLastFilterAndPage();
                this.rejectFacade.refreshWithLastFilterAndPage();
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

    reject(detail: DetailsRejectDto): void {
        this._actionLoading.set(true);

        const command = new DetailsRejectCommand(
            detail.uniqId,
            detail.comment,
            detail.reason,
            detail.callbackType
        );

        this.handleActionWithRefresh(
            this.rejectBus.dispatch(command),
            'COMMON.SUCCESS.REJECT',
            () => {
                this.closeFacade.refreshWithLastFilterAndPage();
                this.rejectFacade.refreshWithLastFilterAndPage();
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
