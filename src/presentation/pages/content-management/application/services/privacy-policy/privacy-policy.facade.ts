import { inject, Injectable, signal } from '@angular/core';
import { PrivacyPolicyCreateCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-create.command';
import { PrivacyPolicyDeleteCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-delete.command';
import { PrivacyPolicyPublishCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-publish.command';
import { PrivacyPolicyUnpublishCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-unpublish.command';
import { PrivacyPolicyUpdateCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-update.command';
import { PrivacyPolicyCreateBus } from '@pages/content-management/application/commands-bus/privacy-policy/privacy-policy-create.bus';
import { PrivacyPolicyDeleteBus } from '@pages/content-management/application/commands-bus/privacy-policy/privacy-policy-delete.bus';
import { PrivacyPolicyPublishBus } from '@pages/content-management/application/commands-bus/privacy-policy/privacy-policy-publish.bus';
import { PrivacyPolicyUnpublishBus } from '@pages/content-management/application/commands-bus/privacy-policy/privacy-policy-unpublish.bus';
import { PrivacyPolicyUpdateBus } from '@pages/content-management/application/commands-bus/privacy-policy/privacy-policy-update.bus';
import { PrivacyPolicyCreateDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-create.dto';
import { PrivacyPolicyDeleteDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-delete.dto';
import { PrivacyPolicyFilterDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-filter.dto';
import { PrivacyPolicyPublishDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-publish.dto';
import { PrivacyPolicyUnpublishDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-unpublish.dto';
import { PrivacyPolicyUpdateDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-update.dto';
import { PrivacyPolicyQuery } from '@pages/content-management/application/queries/privacy-policy/privacy-policy.query';
import { PrivacyPolicyBus } from '@pages/content-management/application/queries-bus/privacy-policy/privacy-policy.bus';
import { PrivacyPolicyEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';
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
export class PrivacyPolicyFacade extends BaseFacade<
    PrivacyPolicyEntity,
    PrivacyPolicyFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(PrivacyPolicyBus);
    private readonly createBus = inject(PrivacyPolicyCreateBus);
    private readonly updateBus = inject(PrivacyPolicyUpdateBus);
    private readonly publishBus = inject(PrivacyPolicyPublishBus);
    private readonly unpublishBus = inject(PrivacyPolicyUnpublishBus);
    private readonly deleteBus = inject(PrivacyPolicyDeleteBus);

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
        filter: PrivacyPolicyFilterDto = {},
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

        const command = new PrivacyPolicyQuery(
            filter?.search,
            filter?.version,
            filter?.status,
            filter?.startDate,
            filter?.endDate
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
        const command = new PrivacyPolicyQuery(
            filter?.search,
            filter?.version,
            filter?.status,
            filter?.startDate,
            filter?.endDate
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
        const command = new PrivacyPolicyQuery(
            filter?.search,
            filter?.version,
            filter?.status,
            filter?.startDate,
            filter?.endDate
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

    private refreshWithLastFilterAndPage(): void {
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new PrivacyPolicyQuery(
            filter?.search,
            filter?.version,
            filter?.status,
            filter?.startDate,
            filter?.endDate
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

    create(dto: PrivacyPolicyCreateDto): void {
        this._actionState.set('loading');

        const command = new PrivacyPolicyCreateCommand(
            dto.version,
            dto.content
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

    update(dto: PrivacyPolicyUpdateDto): void {
        this._actionState.set('loading');
        const command = new PrivacyPolicyUpdateCommand(
            dto.uniqId,
            dto.version,
            dto.content
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

    publish(team: PrivacyPolicyPublishDto): void {
        const command = new PrivacyPolicyPublishCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.publishBus.dispatch(command),
            'COMMON.SUCCESS.PUBLISH'
        ).subscribe();
    }

    unpublish(team: PrivacyPolicyUnpublishDto): void {
        const command = new PrivacyPolicyUnpublishCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.unpublishBus.dispatch(command),
            'COMMON.SUCCESS.UNPUBLISH'
        ).subscribe();
    }

    delete(team: PrivacyPolicyDeleteDto): void {
        const command = new PrivacyPolicyDeleteCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
