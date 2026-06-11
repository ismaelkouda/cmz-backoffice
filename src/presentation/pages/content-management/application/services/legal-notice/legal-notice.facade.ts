import { inject, Injectable, signal } from '@angular/core';
import { LegalNoticeCreateCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-create.command';
import { LegalNoticeDeleteCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-delete.command';
import { LegalNoticePublishCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-publish.command';
import { LegalNoticeUnpublishCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-unpublish.command';
import { LegalNoticeUpdateCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-update.command';
import { LegalNoticeCreateBus } from '@pages/content-management/application/commands-bus/legal-notice/legal-notice-create.bus';
import { LegalNoticeDeleteBus } from '@pages/content-management/application/commands-bus/legal-notice/legal-notice-delete.bus';
import { LegalNoticePublishBus } from '@pages/content-management/application/commands-bus/legal-notice/legal-notice-publish.bus';
import { LegalNoticeUnpublishBus } from '@pages/content-management/application/commands-bus/legal-notice/legal-notice-unpublish.bus';
import { LegalNoticeUpdateBus } from '@pages/content-management/application/commands-bus/legal-notice/legal-notice-update.bus';
import { LegalNoticeCreateDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-create.dto';
import { LegalNoticeDeleteDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-delete.dto';
import { LegalNoticeFilterDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-filter.dto';
import { LegalNoticePublishDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-publish.dto';
import { LegalNoticeUnpublishDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-unpublish.dto';
import { LegalNoticeUpdateDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-update.dto';
import { LegalNoticeQuery } from '@pages/content-management/application/queries/legal-notice/legal-notice.query';
import { LegalNoticeBus } from '@pages/content-management/application/queries-bus/legal-notice/legal-notice.bus';
import { LegalNoticeEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeFacade extends BaseFacade<
    LegalNoticeEntity,
    LegalNoticeFilterDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(LegalNoticeBus);
    private readonly createBus = inject(LegalNoticeCreateBus);
    private readonly updateBus = inject(LegalNoticeUpdateBus);
    private readonly publishBus = inject(LegalNoticePublishBus);
    private readonly unpublishBus = inject(LegalNoticeUnpublishBus);
    private readonly deleteBus = inject(LegalNoticeDeleteBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    private handleActionWithRefresh<T>(
        observable: Observable<T>,
        successKey: string
    ): Observable<T> {
        return handleObservableWithFeedback(
            observable,
            this.uiFeedback,
            successKey,
            () => this.refreshWithLastFilterAndPage()
        );
    }

    readAll(
        filter: LegalNoticeFilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        const command = new LegalNoticeQuery(
            filter?.search,
            filter?.version,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new LegalNoticeQuery(
            filter?.search,
            filter?.version,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(null, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        const command = new LegalNoticeQuery(
            filter?.search,
            filter?.version,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    private refreshWithLastFilterAndPage(): void {
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new LegalNoticeQuery(
            filter?.search,
            filter?.version,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
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

    create(legalNotice: LegalNoticeCreateDto): void {
        this._actionState.set('loading');

        const command = new LegalNoticeCreateCommand(
            legalNotice.version,
            legalNotice.content
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

    update(legalNotice: LegalNoticeUpdateDto): void {
        this._actionState.set('loading');
        const command = new LegalNoticeUpdateCommand(
            legalNotice.uniqId,
            legalNotice.version,
            legalNotice.content
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

    publish(team: LegalNoticePublishDto): void {
        const command = new LegalNoticePublishCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.publishBus.dispatch(command),
            'COMMON.SUCCESS.PUBLISH'
        ).subscribe();
    }

    unpublish(team: LegalNoticeUnpublishDto): void {
        const command = new LegalNoticeUnpublishCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.unpublishBus.dispatch(command),
            'COMMON.SUCCESS.UNPUBLISH'
        ).subscribe();
    }

    delete(team: LegalNoticeDeleteDto): void {
        const command = new LegalNoticeDeleteCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
